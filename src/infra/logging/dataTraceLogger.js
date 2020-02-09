const Log4js = require('log4js');

/**
 *
 * The dataTraceLogger is a wrapper over the log4js data logging, it injects
 * a specific Id to identify the log and choose the logger to choose.
 *
 * This can be used to inject any kind of data in the logs.
 */

var TraceData ={
  user_id:''
};


module.exports = ({ config }) => {
  Log4js.configure(config.logging);

  let logger  =  Log4js.getLogger('trace');
  let toFileLogger  =  Log4js.getLogger('traceFile');
  return {
    logger:logger,
    toFileLogger:toFileLogger,
    trace:(data)=>{
      logger.trace({
        id:TraceData.user_id,
        log:data
      });
    },
    error:(data)=>{
      logger.error({
        id:TraceData.user_id,
        log:data
      });
    },
    setuserID:(id)=>{
      TraceData.user_id=id;

    },
    traceStaticData:TraceData
  };
};
