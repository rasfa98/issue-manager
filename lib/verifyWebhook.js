/**
 * Module for verifying the webhook POST requests.
 *
 * @module lib/verifyWebhook.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const crypto = require('crypto')
 const secureCompare = require('secure-compare')

 /**
  * Verifies that the POST request comes from GitHub.
  *
  * @param {object} req Request object.
  * @param {object} res Response object.
  * @param {function} next Function needed to continue in the chain.
  */
 module.exports = (req, res, next) => {
   const signature = req.headers['x-hub-signature']

   const body = Object.keys(req.body).length === 0 ? 'undefined' : req.body

   const secret = 'sha1=' + crypto.createHmac('sha1', process.env.HOOK_SECRET)
   .update(body).digest('hex')

   secureCompare(signature, secret) ? next() : res.sendStatus(404)
 }
