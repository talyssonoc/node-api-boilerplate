const { inject } = require('awilix-express');

/**
 * The controller logger wrapper is used to inject an operation (module)
 * and inject into the operation the loggingController to listen to success and error events
 * and respectively delete temporary trace or store in file.
 * @param module
 * @returns {*[]}
 */
module.exports=(module)=>{
  console.log(module);
  return [inject(module), (req, res, next)=>{
    req[module]= new req.ControllerLogger(req, req[module]);
    next();
  }];
};
