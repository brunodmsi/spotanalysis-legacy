/* eslint-disable no-await-in-loop */
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

import spotify from '../../services/spotify';
import api from '../../services/api';

import AudioFeatureTable from '../../components/AudioFeatureTable/index';
import Spinner from '../../components/Spinner/index';
import Bubble from '../../components/BubbleChart/index';

import {
  Container, Form, Logo, Wrap, Error, TracksButton, Select,
} from './styles';

import logo from '../../assets/logo.png';
import 'dotenv/config';

const Main = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [loudDanc, setLoudDanc] = useState('');
  const [track, setTracker] = useState('');
  const [eneDanc, setEneDanc] = useState('')
  const [isTrackLoaded, setIsTrackLoaded] = useState(false);
  const [selected, setSelected] = useState('playlist');
  const [playlistInfo, setPlaylistInfo] = useState('');

  useEffect(() => {
    const ACCESS_TOKEN = localStorage.getItem('@Spotanalysis:accessToken');
    const param = window.location.hash;

    if (ACCESS_TOKEN) {
      if (param.startsWith('#access_token')) {
        const [, token] = param.split(/[=&]/);
        localStorage.setItem('@Spotanalysis:accessToken', token);
        spotify.setAccessToken(token);
        window.location.reload();
      } else {
        window.location.href = `${process.env.REACT_APP_API}/login`;
      }
    } else {
      spotify.setAccessToken(ACCESS_TOKEN);
      spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', (err, data) => {
        if (err) {
          localStorage.removeItem('@Spotanalysis:accessToken');
          window.location.href = `${process.env.REACT_APP_API}/login`;
        }
      });
    }
  }, []);

  const loadAudioFeaturesTable = useCallback((track) => {
    setTracker(track);
    setLoading(false);
    setIsTrackLoaded(true);
    setShowGraph(false);
  })

  const getAudioFeatures = useCallback(async (val) => {
    if (val === '') {
      setError('You need to input a track')
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { tracks } = await spotify.searchTracks(val, { limit: 5 });
      const track = tracks.items[0];
      const audioFeature = await spotify.getAudioFeaturesForTrack(track.id);

      const wrap = [];
      wrap.push(track);
      wrap.push(audioFeature);

      const { data } = await api.post('/save_track', wrap);

      loadAudioFeaturesTable(data);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      setShowGraph(false);
    }
  }, [])

  const getUserPlaylist = useCallback(async (val) => {
    setLoading(true);
    setShowGraph(false);

    const [, id] = val.split('playlist/');

    try {
      const playlist = await spotify.getPlaylist(id);
      delete playlist.tracks;

      setPlaylistInfo(playlist)

      let offset = 0;
      let songs = [];

      const ids = [];
      while (true) {
        const content = await spotify.getPlaylistTracks(id, { limit: 100, offset });
        songs = songs.concat(content.items);

        if (content.next !== null) offset += 100;
        else break;
      }

      for (let i = 0; i < songs.length; i += 1) {
        ids.push(songs[i].track.id);
      }

      let index = 0;
      const af = [];
      while (index < ids.length) {
        let tmp = [];
        for (let i = index; i < index + 50; i += 1) {
          tmp.push(ids[i]);
        }

        af.push(await spotify.getAudioFeaturesForTracks(tmp));

        index += 50;
        tmp += '';
      }

      const energyAndDanc = [];
      const loudAndDanc = [];
      for (let i = 0; i < af.length; i += 1) {
        for (let j = 0; j < af[i].audio_features.length; j += 1) {
          energyAndDanc.push({
            data: {
              label: songs[j].track.name,
              y: af[i].audio_features[j].energy,
              x: af[i].audio_features[j].danceability,
              r: 2,
            },
          });
          loudAndDanc.push({
            data: {
              label: songs[j].track.name,
              y: af[i].audio_features[j].loudness,
              x: af[i].audio_features[j].danceability,
              r: 2,
            },
          });
        }
      }

      setLoading(false);
      setShowGraph(true);
      setLoudDanc(loudAndDanc);
      setEneDanc(energyAndDanc);
      setIsTrackLoaded(false);
    } catch (err) {
      setError(err.toString())
      setLoading(false)
      setIsTrackLoaded(false)
    }
  }, [])

  return (
    <Container>
      <Logo src={logo} alt="Spotanalysis" />
      <Wrap>
        {error !== '' ? (
          <Error>
            <p>{error}</p>
          </Error>
        ) : (
          ''
        )}
        <Form>
          <input
            type="text"
            placeholder={
              selected === 'playlist' ? 'Playlist Audio Features' : 'Track Audio Features'
            }
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              setValue('');
              if (selected === 'playlist') getUserPlaylist(value);
              else getAudioFeatures(value);
            }}
          >
            OK
          </button>
        </Form>
        <div>
          <Link to="/tracks">
            <TracksButton>See all</TracksButton>
          </Link>
          {selected === 'track' ? (
            <Select onClick={() => setSelected('playlist')}>Playlist</Select>
          ) : (
            <Select onClick={() => setSelected('track')}>Track</Select>
          )}
        </div>
      </Wrap>
      <br />

      <Spinner loading={loading} />

      {showGraph ? (
        <Bubble data={loudDanc} info={playlistInfo} title="Loudness x Danceability" />
      ) : (
        ''
      )}
      {showGraph ? (
        <Bubble data={eneDanc} info={playlistInfo} title="Energy x Danceability" />
      ) : (
        ''
      )}

      {isTrackLoaded ? <AudioFeatureTable track={track} /> : ''}
    </Container>
  );
}

export default Main;
