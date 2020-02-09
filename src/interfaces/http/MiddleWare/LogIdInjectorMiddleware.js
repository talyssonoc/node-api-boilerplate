const uuidv4 = require('uuid/v4');

/**
 * This will inject a request Id for every request and use that to store the trace related
 * to that request. using this id, the trace can then be identified and either stored
 * in case of error or deleted in case of success.
 * @param config
 * @param Tracelogger
 * @returns {Function}
 */
module.exports=({config, Tracelogger})=>{
  return  (req, res, next)=>{
    req.headers[config.memoryloggerId] = uuidv4();
    Tracelogger.setuserID(req.headers[config.memoryloggerId]);
    next();
  };
};
