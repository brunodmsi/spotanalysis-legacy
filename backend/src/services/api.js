const axios = require('axios')
require('dotenv/config');

const api = axios.create({
  baseURL: process.env.SPOTIFY_API
});

module.exports = api;
