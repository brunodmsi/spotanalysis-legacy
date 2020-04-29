import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Modal from 'react-awesome-modal';

import api from '../../services/api';

import Spinner from '../../components/Spinner/index';
import AudioFeatureTable from '../../components/AudioFeatureTable/index';

import {
  Container,
  Logo,
  TopSong,
  TopSongText,
  Image,
  Separator,
  TopSongInfo,
  Song,
  DivisorTxt,
} from './styles';

import logo from '../../assets/logo.png';

const Tracks = () => {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [topTrack, setTopTrack] = useState({});
  const [selectedTrack, setSelectedTrack] = useState({});

  useEffect(() => {
    async function loadData() {
      const { data: tracks } = await api.get('/tracks');

      const topTrack = tracks[0];
      tracks.shift();

      setTopTrack(topTrack);
      setTracks(tracks);
      setLoading(false);
    }

    loadData();
  });

  const modalVisibility = useCallback(() => {
    setVisible(!visible);
  }, [visible])

  const setModalTrack = useCallback((track) => {
    setSelectedTrack(track);

    modalVisibility();
  });

  return (
    <Container>
      <Logo alt="Spotanalysis" src={logo} />
      <Link to="/" style={{ paddingBottom: 20 }}>
        Voltar
      </Link>
      <Spinner loading={loading} />
      {!loading ? (
        <div>
          <TopSongText>Most searched song:</TopSongText>
          <TopSong>
            <div>
              <a href={topTrack.album[0].external_urls.spotify}>
                <Image src={topTrack.album[0].images[0].url} alt="album" />
              </a>
            </div>
            <TopSongInfo>
              <p>
                Name:&nbsp;<strong>{topTrack.name}</strong>
              </p>
              Artist(s):&nbsp;
              {topTrack.artists.map(artist => (
                <strong>
                  <a href={artist[0].external_urls.spotify}>
                    {artist[0].name}
                    <br />
                  </a>
                </strong>
              ))}
              <p>
                Times searched: <strong>{topTrack.times_searched}</strong>
              </p>
              <br />
              <button type="button" onClick={() => setModalTrack(topTrack)}>
                Audio Features
              </button>
            </TopSongInfo>
          </TopSong>

          <DivisorTxt>Other searched songs:</DivisorTxt>

          {tracks.map(track => (
            <div>
              <Song>
                <a href={track.album[0].external_urls.spotify}>
                  <Image src={track.album[0].images[0].url} alt="album" />
                </a>
                <TopSongInfo>
                  <p>
                    Name:&nbsp;<strong>{track.name}</strong>
                  </p>
                  Artist(s):&nbsp;
                  {track.artists.map(artist => (
                    <strong>
                      <a href={artist[0].external_urls.spotify}>
                        {artist[0].name}
                        <br />
                      </a>
                    </strong>
                  ))}
                  <p>
                    Times searched: <strong>{track.times_searched}</strong>
                  </p>
                  <button type="button" onClick={() => setModalTrack(track)}>
                    Audio Features
                  </button>
                </TopSongInfo>
              </Song>

              <Separator />
            </div>
          ))}
        </div>
      ) : (
        ''
      )}

      <Modal
        visible={visible}
        width="500"
        height="800"
        effect="fadeInUp"
        onClickAway={() => modalVisibility()}
      >
        <div style={{ backgroundColor: '#271F2C', alignItems: 'center' }}>
          {selectedTrack !== '' ? <AudioFeatureTable track={selectedTrack} /> : ''}
        </div>
      </Modal>
    </Container>
  );
}

export default Tracks;
