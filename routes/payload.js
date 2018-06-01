/**
 * Module for the payload routes.
 *
 * @module routes/payload.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const router = require('express').Router()
 const verifyWebhook = require('../lib/verifyWebhook')

 router.route('/')
     .post(verifyWebhook, (req, res) => {
       const io = req.app.get('io')

       const payload = JSON.parse(req.body)

       const issue = {
         id: `id_${payload.issue.number}`,
         title: payload.issue.title,
         body: payload.issue.body || 'This issue is empty...',
         comments: payload.issue.comments,
         created: payload.issue.created_at.slice(0, 10),
         url: payload.issue.html_url,
         user: payload.issue.user }

       if (payload.action === 'opened') { io.emit('open', issue) }
       if (payload.action === 'reopened') { io.emit('reopen', issue) }
       if (payload.action === 'closed') { io.emit('close', issue.id) }
       if (payload.action === 'edited' && payload.comment === undefined) { io.emit('edit', { id: issue.id, title: issue.title, body: issue.body }) }

       if (payload.action === 'created' || payload.action === 'deleted') { io.emit('changeCommentCount', { id: issue.id, action: payload.action, comments: issue.comments }) }

       if (payload.comment) { io.emit('commentNotification', { action: payload.action, title: issue.title, body: payload.comment.body, user: issue.user }) }
       if (!payload.comment) { io.emit('issueNotification', { action: payload.action, title: issue.title, user: issue.user }) }

       res.sendStatus(200)
     })

 // Exports
 module.exports = router
