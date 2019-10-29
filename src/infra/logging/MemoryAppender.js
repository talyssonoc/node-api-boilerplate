/**
 * The memory appender is an appender for log4js. it is not found as a dependency
 * but as an implementation inside our code. it handles Trace logs by saving them in
 * memory in a variable called Buffermap.
 * The buffer Map variable holds all the traces for the current running requests
 * once the request is closed the traces are either deleted, or saved to file and then
 * deleted form memory, all based on the  outcome fo the request.
 *
 * The memory appender follows the log4js memory adapter specification with
 * a small alteration that lets us access the buffer map variable from memory
 * as that is not natively supported by log4js specification.
 */

var oglayouts = undefined;
var buffer = null;
var maxBufferSize = null;
var bufferMap = null;

var options = options || {};
buffer = options.buffer || [];
bufferMap = options.bufferMap || {};
maxBufferSize = options.maxBufferSize || 100;



module.exports.config = ()=>{

  return (config, layouts, findAppender, levels) => {
    oglayouts=layouts;
    var layout = null;
    if (config.layout) {
      layout = layouts.layout(config.layout.type, config.layout);
    }
    if(config.maxBufferSize){
      maxBufferSize = config.maxBufferSize;
    }
    return memoryAppender(layout, config.timezoneOffset);
  };


};

var memoryAppender = function memoryAppender(layout, timezoneOffset) {
  layout = layout || oglayouts?oglayouts.basicLayout:undefined;
  return function(loggingEvent) {
    if((buffer.length + 1) > maxBufferSize)
    {
      var numtoRemove = (buffer.length - maxBufferSize) + 1;
      if(numtoRemove > 0){ buffer.splice(0, numtoRemove); }
    }
    let id = loggingEvent.data[0]?loggingEvent.data[0].id?loggingEvent.data[0].id:'na':'na';

    if(!bufferMap[id]){
      bufferMap[id]=[];
    }

    bufferMap[id].push(layout(loggingEvent, timezoneOffset));

  };
};


module.exports.buffer = {
  bufferMap:bufferMap,
  deletemyLog:(id)=>{
    delete bufferMap[id];
    return true;
  },
  gemyLog:(id)=>{
    return bufferMap[id];
  }

};


