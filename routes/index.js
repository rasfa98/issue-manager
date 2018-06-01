/**
 * Module for the index routes.
 *
 * @module routes/index.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const github = require('octonode')

router.route('/')
    .get((req, res) => {
      const client = github.client(process.env.ACC_TOKEN)

      client.get(`/repos/1dv023/rf222fu-examination-3/issues`, (err, status, body, headers) => {
        if (err) { console.log(err) }

        const context = {
          issues: body.map(x => {
            return {
              id: `id_${x.number}`,
              title: x.title,
              body: x.body || 'This issue is empty...',
              comments: x.comments,
              created: x.created_at.slice(0, 10),
              user: x.user.login,
              url: x.html_url }
          })
        }

        res.render('index', context)
      })
    })

// Exports
module.exports = router
