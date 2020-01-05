const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');
const tracePath = path.join(__dirname, '../../logs/trace.log');
var config = require('src/infra/logging/MemoryAppender');
const fs = require('fs');
const ENV = process.env.NODE_ENV || 'development';
const configUtils = require('../../configUtils');
const JSONFileHandlingService = require('src/infra/files').JSONFileHandler;
//a global variable holding the configuration is not the ideal way since it can have
//sensitive information so this should be moved elsewhere
var cfg = {};
var fileCfg ={};
var extraConfig={
  'logging': {
    'appenders': {
      'file': {
        'filename': logPath
      },
      'trace': {
        'type': {
          'configure': config.config()
        },
      },
      'traceFile': {
        'filename': tracePath,
      }
    },

  }
};


  //defining the file and setting the configuration
const file = path.join(__dirname,  ENV)+'.json';
//loading the initial configuration
load();
//setting the listener for json file changes to reload the configuration
fs.watchFile(file, load);

//injecting variables using the objectAssign

function load() {
  const parsed = JSON.parse(fs.readFileSync(file));
  Object.assign(fileCfg, parsed);
  cfg = Object.assign({}, fileCfg, cfg);
  configUtils.setDatawithHierarchy(cfg, extraConfig);
}


function setConfig(hierarchy){

  if(hierarchy){
    if(hierarchy.constructor === Object){
      let strings = configUtils.getStringOutOfHierarchy(hierarchy);

      strings.forEach((elem)=>{
        if(fileCfg[elem.split('.')[0]]){
          JSONFileHandlingService.setToJsonFile(file, elem, configUtils.getdataWithString(hierarchy, elem));
        }else{
          configUtils.setdataWithString(extraConfig, elem, configUtils.getdataWithString(hierarchy, elem));
        }
      });
    }

    load();
  }else{
    throw 'the hierarchy argument is mandatory';
  }
}


function getConfig(){
  return cfg;
}

module.exports= {
  config:cfg,
  set:(hierarchy)=>{
    return setConfig(hierarchy);
  },
  get:()=>{
    return getConfig();
  }
};



//deprecated
//left for comparison
/*
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
*/
