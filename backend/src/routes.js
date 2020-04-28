const express = require('express')

const routes = express.Router()

const TrackController = require('./app/controllers/TrackController');
const AccessController = require('./app/controllers/AccessController');

routes.get('/login', AccessController.login)
routes.get('/callback', AccessController.callback)
routes.post('/refresh', AccessController.refresh)

routes.get('/tracks', TrackController.index)
routes.get('/tracks/:id', TrackController.show)
routes.post('/save_track', TrackController.store)

module.exports = routes
