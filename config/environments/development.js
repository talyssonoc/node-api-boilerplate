const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');
const tracePath = path.join(__dirname, '../../logs/trace.log');
var config = require('src/infra/logging/MemoryAppender');

module.exports = {
  web: {
    port: 4000
  },
  logging: {
    appenders: {
      console :{ type: 'console' },
      file: { type: 'file', filename: logPath },
      trace :{
        type: {
          configure:config.config()
        },
        layout: {
          type: 'pattern',
          pattern: '%d %p %c %x{user} %m%n',
        }
      },
      traceFile: {
        type: 'file',
        filename: tracePath,
        layout: {
          type: 'pattern',
          pattern: '%m%n',
        }
      },
    },
    categories: {
      default:
        {
          appenders:
            [
              'console',
              'file',

            ],
          level: 'debug'
        },
      trace: {
        appenders:
          [
            'trace'
          ],
        level:'TRACE'
      },
      traceFile:{
        appenders:
          [
            'traceFile'
          ],
        level:'ALL'
      }

    }
  },
  memoryloggerId:'x-test-req-ID'
};
