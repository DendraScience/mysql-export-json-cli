const chalk = require('chalk')
const check = require('check-types')
const file = require('../lib/file')
const mysql = require('mysql')
const parse = require('../lib/parse')
const style = require('../lib/style')
const tasks = require('./tasks')
const utils = require('../lib/utils')
const {TaskCommand} = require('@dendra-science/task-command')

module.exports = function (app) {
  // Decorate app with the command processor
  // TODO: Do this better - perhaps mixin eval
  app.command = new TaskCommand(tasks({
    app,
    chalk,
    check,
    file,
    mysql,
    parse,
    style,
    utils
  }))
}
