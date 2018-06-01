/**
 * Module for the client logic.
 *
 * @module public/js/client.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const socket = window.io.connect('https://rasfa98.tk/')
 const container = document.querySelector('.container')
 const notificationList = document.querySelector('.dropdown-menu')

 socket.on('open', issue => addIssueToDom(issue))
 socket.on('close', id => toggleStateButton(id))

 socket.on('reopen', issue => {
   const issueToReopen = document.querySelector(`#${issue.id}`)

   if (issueToReopen) { toggleStateButton(issue.id) }
   if (!issueToReopen) { addIssueToDom(issue) }
 })

 socket.on('edit', issue => {
   const issueToEdit = document.querySelector(`#${issue.id}`)

   issueToEdit.querySelector('.title').textContent = issue.title
   issueToEdit.querySelector('.body').textContent = issue.body
 })

 socket.on('changeCommentCount', issue => {
   const issueToChange = document.querySelector(`#${issue.id}`)

   if (issue.action === 'created') { issueToChange.querySelector('.comments').textContent = issue.comments + 1 }
   if (issue.action === 'deleted') { issueToChange.querySelector('.comments').textContent = issue.comments - 1 }
 })

 socket.on('issueNotification', data => {
   const notification = createNotification(data.user.avatar_url)
   notification.textContent = `${data.user.login}, "${data.action}" the issue "${data.title}"`
 })

 socket.on('commentNotification', data => {
   const notification = createNotification(data.user.avatar_url)

   if (data.action === 'created') { notification.textContent = `${data.user.login}, commented "${data.body}" on the issue "${data.title}"` }
   if (data.action === 'deleted') { notification.textContent = `${data.user.login}, "${data.action}" a comment from the issue "${data.title}"` }
   if (data.action === 'edited') { notification.textContent = `${data.user.login}, "${data.action}" a comment on the issue "${data.title}"` }
 })

 document.addEventListener('click', e => {
   if (e.target.closest('.issue')) {
     const id = e.target.closest('.issue').id.slice(3)

     if (e.target.classList.contains('editState')) {
       if (e.target.classList.contains('closeIssue')) { socket.emit('editState', { id: id, state: 'close' }) }
       if (!e.target.classList.contains('closeIssue')) { socket.emit('editState', { id: id, state: 'open' }) }
     }
   }
 })

 /**
  * Adds an issue to the DOM.
  *
  * @param {object} issue The issue that will be added.
  */
 function addIssueToDom (issue) {
   const template = importTemplate('issue')
   const latestIssue = document.querySelector('.issue')

   template.querySelector('.user').textContent = issue.user.login
   template.querySelector('.title').textContent = issue.title
   template.querySelector('.body').textContent = issue.body
   template.querySelector('.comments').textContent = issue.comments
   template.querySelector('.created').textContent = issue.created
   template.querySelector('.url').href = issue.url

   container.insertBefore(template, latestIssue)

   document.querySelector('.issue').id = issue.id
 }

 /**
  * Imports a template.
  *
  * @param {string} id ID of the template.
  * @returns {object} The cloned template.
  */
 function importTemplate (id) {
   const templateClone = document.querySelector(`#${id}`)
   return document.importNode(templateClone.content, true)
 }

 /**
  * Creates a new notification.
  *
  * @param {object} avatarURL The github avatar URL.
  * @returns {object} The element where the message will be added.
  */
 function createNotification (avatarURL) {
   const latestNotification = document.querySelector('.notification')
   const template = importTemplate('notification')

   template.querySelector('img').src = avatarURL
   notificationList.insertBefore(template, latestNotification)

   return document.querySelector('.notification .notificationText')
 }

 /**
  * Toggles the close/reopen button.
  *
  * @param {string} id ID of the issue with the button.
  */
 function toggleStateButton (id) {
   const button = document.querySelector(`#${id}`).querySelector('.editState')

   button.classList.toggle('closeIssue')
   button.classList.toggle('btn-outline-danger')
   button.classList.toggle('btn-outline-secondary')

   if (!button.classList.contains('closeIssue')) { button.textContent = 'Reopen issue' }
   if (button.classList.contains('closeIssue')) { button.textContent = 'Close issue' }
 }
