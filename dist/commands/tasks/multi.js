'use strict';

const Exporter = require('@dendra-science/mysql-export-json');
const ora = require('ora');
const { promisify } = require('util');
const { Writable } = require('stream');

const TOKEN_REGEX = /{([.\w]+)}/g;

async function exportData(dataLeft, fn, { file, output, p }) {
  let dataRight;

  if (p.merge) {
    try {
      dataRight = await file.loadJson({
        file: fn
      });
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }

  if (p.dry_run) {
    if (dataRight) {
      output.push([{ text: 'Will merge', tail: ':' }, fn]);
    } else {
      output.push([{ text: 'Will save', tail: ':' }, fn]);
    }
  } else {
    let data = dataLeft;
    let didMerge;

    if (!dataRight) {} else if (p.merge === 'ltr') {
      data = Object.assign({}, dataRight, dataLeft);
      didMerge = true;
    } else if (p.merge === 'rtl') {
      data = Object.assign({}, dataLeft, dataRight);
      didMerge = true;
    }

    const out = await file.saveJson(data, p, null, {
      file: fn,
      save: true
    }, {
      text: didMerge && 'Merged'
    });

    if (p.verbose && Array.isArray(out)) output.push(...out);
  }
}

module.exports = ({ check, file, mysql, parse, style, utils }) => {
  return {
    check(p) {
      check.assert.nonEmptyString(p.filetmpl, `Required: filetmpl`);
      return true;
    },

    beforeExecute(p) {
      parse.connectArgs(p);
      parse.exportArgs(p);
    },

    async execute(p) {
      const connection = mysql.createConnection(p.connectOptions);
      const connect = promisify(connection.connect.bind(connection));
      const endConn = promisify(connection.end.bind(connection));

      await connect();

      const exp = new Exporter(connection, p.exportOptions);
      const spinner = ora({
        spinner: 'bouncingBar',
        stream: process.stdout,
        text: 'Exporting...'
      }).start();

      let count = 0;
      let output = [];

      const filetmpl = decodeURIComponent(p.filetmpl);
      const fileWriter = new Writable({
        objectMode: true,
        write(data, encoding, callback) {
          const fn = filetmpl.replace(TOKEN_REGEX, (_, k) => utils.getByDot(data, k));

          count++;
          spinner.text = `Exporting file: ${fn}`;

          exportData(data, fn, { file, output, p }).then(() => callback()).catch(err => callback(err));
        }
      });

      const expStream = exp.stream();
      expStream.pipe(fileWriter);

      await new Promise((resolve, reject) => {
        expStream.on('error', reject);
        fileWriter.on('error', reject);
        fileWriter.on('finish', resolve);
      }).finally(() => endConn());

      spinner.succeed(`Exported ${count} file(s)`);

      output.push(style.EMPTY);
      output.push('Done!');

      return output;
    }
  };
};