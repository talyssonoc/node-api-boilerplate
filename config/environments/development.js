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
  memoryloggerId:'x-test-req-ID',
  appMetrics:{
    replSocketURL:'localhost:4001',
    userAppMetric:true,
    tracking:{
      cpu:true,
      eventloop:true,
      profiling:true,
      http:{
        use:true,
        config:{
          filters:{
            pattern:'', //(String) a regular expression pattern to match HTTP method and URL against, eg. 'GET /favicon.ico$'
            to:''       //(String) a conversion for the URL to allow grouping. A value of '' causes the URL to be ignored.
          }
        }
      },
      mongo:true,
      socketio:true,
      mqlight:true,
      postgresql:true,
      mqtt:true,
      mysql:true,
      redis:true,
      riak:true,
      memcached:true,
      oracledb:true,
      oracle:true,
      'strong-oracle':true,
      requests:{
        use:true,
        config:{
          excludeModules:[] //(Array) of String names of modules to exclude from request tracking.
        }
      },
      trace:{
        use:true,
        config:{
          includeModules:[] //Array) of String names for modules to include in function tracing. By default only non-module functions are traced when trace is enabled.
        }
      }
    }
  }
};
