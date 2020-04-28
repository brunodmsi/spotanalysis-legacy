const axios = require('axios')
require('dotenv/config');

const api = axios.default.create({
  baseURL: process.env.SPOTIFY_URI
});

module.exports = api;
