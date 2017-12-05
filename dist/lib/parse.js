'use strict';

/**
 * CLI parsing functions.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module lib/parse
 */

const CONN_REGEX = /^conn:(\w+)$/;
const EXP_REGEX = /^exp:(\w+)$/;

function connectArgs(p) {
  const opts = {};

  Object.keys(p).forEach(key => {
    const matches = key.match(CONN_REGEX);
    const optKey = matches && matches[1];

    if (optKey) opts[optKey] = p[key];
  });

  if (typeof opts.password === 'string') opts.password = decodeURIComponent(opts.password);

  p.connectOptions = opts;
}

exports.connectArgs = connectArgs;

function exportArgs(p) {
  const opts = {};

  Object.keys(p).forEach(key => {
    const matches = key.match(EXP_REGEX);
    const optKey = matches && matches[1];

    if (optKey) opts[optKey] = p[key];
  });

  if (typeof opts.dotSeparator === 'string') opts.dotSeparator = decodeURIComponent(opts.dotSeparator);

  p.exportOptions = opts;
}

exports.exportArgs = exportArgs;