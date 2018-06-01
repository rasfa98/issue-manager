/**
 * Socket.io configuration.
 *
 * @module config/socket.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const github = require('octonode')
 const socket = require('socket.io')

 /**
  * Configures and starts the websocket server.
  *
  * @param {object} server A HTTP server object.
  * @returns IO object.
  */
 module.exports.run = (server) => {
   const io = socket(server)

   io.on('connection', socket => {
     const client = github.client(process.env.ACC_TOKEN)

     socket.on('editState', data => {
       client.issue('1dv023/rf222fu-examination-3', data.id)
       .update({ state: data.state }, cb => {})
     })
   })

   return io
 }
