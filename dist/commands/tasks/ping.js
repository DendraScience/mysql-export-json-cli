'use strict';

const { promisify } = require('util');

module.exports = ({ mysql, parse, utils }) => {
  return {
    beforeExecute(p) {
      parse.connectArgs(p);
    },

    async execute(p) {
      const connection = mysql.createConnection(p.connectOptions);
      const connect = promisify(connection.connect.bind(connection));
      const endConn = promisify(connection.end.bind(connection));

      await connect();
      await utils.sleep(200);
      await endConn();

      return 'Connection successful!';
    }
  };
};