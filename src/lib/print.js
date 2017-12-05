/**
 * CLI output printing.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module lib/print
 */

const chalk = require('chalk')
const jsome = require('jsome')

function print (obj, p) {
  if (obj instanceof Error) {
    console.log(chalk`{inverse  ERR! } ${obj.message}`)
  } else if (Array.isArray(obj)) {
    obj.forEach(el => {
      if (Array.isArray(el)) {
        /*
          The element is an inner array of spans to print. Each span can be a string or object.
         */
        el.forEach((span, i) => {
          if (typeof span === 'number') span = {text: `${span}`}
          else if (typeof span === 'string') span = {text: span}

          const isLast = (i === el.length - 1)
          const tail = span.tail || ''
          const width = typeof span.width === 'number' ? span.width : 14

          let out = `${span.text}`

          if (!isLast && width) {
            const maxLen = width - tail.length

            if (out.length > maxLen) {
              out = out.substr(0, maxLen) + tail // Trim to fit
            } else {
              out += tail
              out += ' '.repeat(width - out.length) // Pad remaining space
            }
          } else {
            out += tail
          }

          if (span.dim) out = chalk.dim(out)
          if (span.bold) out = chalk.bold(out)
          if (span.fg) out = chalk.keyword(span.fg)(out)
          if (span.bg) out = chalk.bgKeyword(span.bg)(out)

          if (isLast) console.log(out)
          else process.stdout.write(out + ' ')
        })
      } else if (typeof el === 'object') {
        /*
          The element is an object to pretty print as JSON.
         */
        console.log(jsome.getColoredString(el))
      } else {
        /*
          The element is none of the above, so just log it.
         */
        console.log(el)
      }
    })
  } else if (typeof obj === 'string') {
    console.log(obj)
  } else if (typeof obj === 'object') {
    if (!p.output || (p.output === 'color')) {
      console.log(jsome.getColoredString(obj))
    } else if ((p.output === 'indent') || (p.output === 'raw')) {
      const indent = (p.output === 'indent') ? 2 : 0
      const str = JSON.stringify(obj, null, indent)

      if (p.n) process.stdout.write(str)
      else console.log(str)
    } else {
      throw new Error(`Output not supported: ${p.output}`)
    }
  }
}

module.exports = print
