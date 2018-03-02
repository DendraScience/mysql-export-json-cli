#!/usr/bin/env node

/**
 * MySQL Export JSON CLI entry point.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module mysql-export-json
 */

const mri = require('mri')
const print = require('./lib/print')

const log = console

process.on('uncaughtException', err => {
  log.error(`An unexpected error occurred\n  ${err.stack}`)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  if (!err) {
    log.error('An unexpected empty rejection occurred')
  } else if (err instanceof Error) {
    log.error(`An unexpected rejection occurred\n  ${err.stack}`)
  } else {
    log.error(`An unexpected rejection occurred\n  ${err}`)
  }
  process.exit(1)
})

require('./app')(log).then(app => {
  const args = process.argv.slice(2)
  const parsed = mri(args, {
    alias: {
      dry_run: 'dry-run'
    },
    boolean: [
      'dry_run',
      'verbose'
    ],
    string: [
      'filepat',
      'merge',
      'output'
    ]
  })

  return app.command.eval(parsed)
}).then(state => {
  print(state.output, state.parsed)
}).catch(err => {
  print(err)
})
