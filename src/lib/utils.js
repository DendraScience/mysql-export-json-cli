/**
 * CLI utilities and helpers.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module lib/utils
 */

/**
 * Adaped from feathers-plus/feathers-hooks-common
 * https://github.com/feathers-plus/feathers-hooks-common/blob/master/lib/common/get-by-dot.js
 */
function getByDot (obj, path) {
  if (path.indexOf('.') === -1) {
    return obj[path]
  }

  return path.split('.').reduce(
    (obj1, part) => (typeof obj1 === 'object' ? obj1[part] : undefined),
    obj
  )
}

exports.getByDot = getByDot

function sleep (ms = 1, value) {
  return new Promise(resolve => setTimeout(resolve, ms)).then(() => value)
}

exports.sleep = sleep
