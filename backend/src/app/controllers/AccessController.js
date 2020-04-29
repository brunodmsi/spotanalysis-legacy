const querystring = require('querystring');
const api = require('../../services/api');

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
      await api.post('/', null, {
        query: {
          access_token: token,
          redirect_uri: process.env.REDIRECT_URI,
          token_type: 'Bearer',
        },
        headers: {
          Authorization: `Basic ${new Buffer(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    res.redirect(process.env.REDIRECT_URI);
    } catch(err) {
      console.log(err);
    }
  }

  async refresh(req, res) {
    const { code } = req.body;

    await api.post('/', {
        grant_type: 'refresh_token',
        refresh_token: code,
    },
    {
      headers: {
        Authorization: `Basic ${new Buffer(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
    })

    return res.send();
  }
}

module.exports = new AccessController();
