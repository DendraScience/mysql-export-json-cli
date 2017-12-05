'use strict';

const path = require('path');

const COMMANDS = ['multi', 'ping'];

module.exports = ctx => {
  const { style } = ctx;
  const tasks = {};

  COMMANDS.forEach(cmd => {
    Object.defineProperty(tasks, cmd, {
      get: () => require(path.join(__dirname, cmd))(ctx)
    });
  });

  return {
    help(p) {
      return style.commandHelp({
        title: 'Command line tool to export MySQL rows as JSON.',
        synopsis: [{ cmd: '<command>', opts: '[<options>] [<args>]' }, {}, { cmd: 'multi', opts: '--filetmpl=<filetmpl> --conn:<connectOption>[=<val>] ... (--exp:sqlString=<str> | --exp:tableName=<name>) [--exp:<exportOption>[=<val>] ...]' }, { cmd: 'ping', opts: '--conn:<connectOption>[=<val>] ...' }],
        groups: [{
          header: 'Connect Options',
          items: [{ opts: '--conn:host=<name>', desc: 'Hostname of the database you are connecting to (default "localhost")' }, { opts: '--conn:port=<number>', desc: 'Port number to connect to (default 3306)' }, { opts: '--conn:user=<user>', desc: 'MySQL user to authenticate as' }, { opts: '--conn:password=<password>', desc: 'MySQL password to authenticate as (URI encoded)' }, { opts: '--conn:database=<name>', desc: 'Name of the database to use for this connection' }, { opts: '--conn:charset=<charset>', desc: 'Charset for the connection (default "UTF8_GENERAL_CI")' }, { opts: '--conn:timezone=<timezone>', desc: 'Timezone configured on the MySQL server (default "local")' }, { opts: '--conn:connectTimeout=<ms>', desc: 'Milliseconds before a timeout occurs during the initial connection (default 10000)' }, { opts: '--conn:supportBigNumbers', desc: 'Enable when dealing with big numbers (BIGINT and DECIMAL columns) in the database' }, { opts: '--conn:bigNumberStrings', desc: 'Combine with supportBigNumbers to return big numbers as JavaScript String objects' }, { opts: '--conn:dateStrings', desc: 'Force date types to be returned as strings rather then inflated into JavaScript Date objects' }]
        }, {
          header: 'Export Options',
          items: [{ opts: '--exp:sqlString=<str>', desc: 'Custom SQL query string to execute (URI encoded)' }, { opts: '--exp:tableName=<name>', desc: 'Name of a table or view to select from, i.e. "SELECT * FROM <name>"' }, { opts: '--exp:limit=<int>', desc: 'Combine with tableName to restrict the number of records (default unlimited)' }, { opts: '--exp:convertTrueFalse', desc: 'Transform string values "true" and "false" into native JavaScript Boolean values' }, { opts: '--exp:dotSeparator=<str>', desc: 'Delimiter string for expanding field names into deep objects (URI encoded, default ".")' }, { opts: '--exp:expand', desc: 'Create deep objects based on field names, e.g. {"some.field": 123} becomes {"some": {"field": 123}}' }, { opts: '--exp:keepNulls', desc: 'Do not discard fields that equal null' }]
        }, {
          header: 'Multi Options',
          items: [{ opts: '--filetmpl=<filetmpl>', desc: 'Template string for naming JSON files (URI encoded), e.g. "{_id}.station.json"' }]
        }, {
          header: 'Commands',
          items: [{ cmd: 'help', desc: 'Show help on commands' }, {}, { cmd: 'multi', desc: 'Export rows into multiple JSON document files' }, { cmd: 'ping', desc: 'Test the connection options only' }]
        }]
      }, p);
    },

    tasks
  };
};