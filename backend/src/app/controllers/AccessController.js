const querystring = require('querystring');
const api = require('../../services/api');
const request = require('request');

require('dotenv/config');

class AccessController {
  async login(req, res) {
    res.redirect(
      `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'token',
        client_id: process.env.CLIENT_ID,
        scope: 'user-read-private user-read-email',
        redirect_uri: process.env.REDIRECT_URI,
        state: 123,
      })}`,
    );
  }

  async callback(req, res) {
    const token = req.query.token || null;

    try {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          access_token: token,
          redirect_uri: REDIRECT_URI,
          token_type: 'Bearer'
        },
        headers: {
          Authorization: `Basic ${new Buffer(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString('base64')}`
        },
        json: true
      }

      request.post(authOptions);
      res.redirect(process.env.REDIRECT_URI);
    } catch(err) {
      console.log(err);
    }
  }

  async refresh(req, res) {
    const { code } = req.body;

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: code
      },
      headers: {
        Authorization: `Basic ${new Buffer(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString('base64')}`
      },
      json: true
    }

    request.post(authOptions);

    return res.send();
  }
}

module.exports = new AccessController();
