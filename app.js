/**
 * Starting point of the application.
 *
 * @module ./app.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const express = require('./config/express')
 const path = require('path')
 const helmet = require('helmet')

 const app = express.run()

 app.use(helmet())

 app.use(helmet.contentSecurityPolicy({
   directives: {
     defaultSrc: ["'self'"],
     styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com', 'code.ionicframework.com'],
     scriptSrc: ["'self'", 'code.jquery.com', 'cdnjs.cloudflare.com', 'maxcdn.bootstrapcdn.com'],
     fontSrc: ["'self'", 'code.ionicframework.com'],
     connectSrc: ['*'],
     imgSrc: ["'self'", '*.githubusercontent.com']
   }
 }))

 app.use('/', require('./routes/index'))
 app.use('/payload', require('./routes/payload'))

 app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'views', 'errors', '404.html')))

 app.use((err, req, res, next) => {
   console.log(err)
   return res.status(500).sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
 })
