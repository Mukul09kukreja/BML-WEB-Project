const express = require('express');
// Pages: server logic and supporting functions.
// Connect pages URLs to their request handlers.
module.exports = function (app) {
  const handlers = require('../controllers/pages')();
  app.get('/', handlers.redirectHome);
  app.get(/^\/[^/]+\.html$/, handlers.renderPage);
  app.use(express.static(require('node:path').join(__dirname, '../../client')));
};
