





module.exports =({appenderBuffer, Tracelogger, config})=>{

  return class ControllerLogger {

    constructor(req, EventEmitterClass, {success, error}={} ){
      this.appenderBuffer = appenderBuffer;
      this.TraceLogger = Tracelogger;


      if(!success){
        success='SUCCESS';
      }

      if(!error){
        error=['VALIDATION_ERROR', 'ERROR', 'NOT_FOUND'];
      }
      if(success instanceof Array){
        success.map((elem, index)=>{
          if(EventEmitterClass.outputs[elem]){
            EventEmitterClass.on(elem, ()=>{
              if(req.headers[config.memoryloggerId]){
                this.appenderBuffer.deletemyLog(req.headers[config.memoryloggerId]);
              }else{
                this.TraceLogger.toFileLogger.trace('Couldn\'t find a headers ID int he given request');
              }
            });
          }
        });
      }else{
        if(success instanceof String){
          if(EventEmitterClass.outputs[success]){
            EventEmitterClass.on(success, ()=>{
              if(req.headers[config.memoryloggerId]){
                this.appenderBuffer.deletemyLog(req.headers[config.memoryloggerId]);
              }else{
                this.TraceLogger.toFileLogger.trace('Couldn\'t find a headers ID int he given request');
              }
            });
          }
        }
      }

      if(error instanceof Array){
        error.map((elem, index)=>{
          if(EventEmitterClass.outputs[elem]){
            EventEmitterClass.on(elem, ()=>{
              if(req.headers[config.memoryloggerId]){
                this.TraceLogger.toFileLogger.trace(this.appenderBuffer.gemyLog(req.headers[config.memoryloggerId]));
              }else{
                this.TraceLogger.toFileLogger.trace('Couldn\'t find a headers ID int he given request');
              }
            });
          }
        });
      }else{
        if(error instanceof String){
          if(EventEmitterClass.outputs[error]){
            EventEmitterClass.on(error, ()=>{
              if(req.headers[config.memoryloggerId]){
                this.TraceLogger.toFileLogger.trace(this.appenderBuffer.gemyLog(req.headers[config.memoryloggerId]));
              }else{
                this.TraceLogger.toFileLogger.trace('Couldn\'t find a headers ID int he given request');
              }
            });
          }

        }
      }
      return EventEmitterClass;
    }
  };

};
