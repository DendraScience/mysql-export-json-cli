'use strict';

/**
 * MySQL Export JSON CLI app.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module app
 */

const commands = require('./commands');

module.exports = async log => {
  const app = {};

  app.logger = log;

  // App setup
  commands(app);

  return app;
};