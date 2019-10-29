const EventEmitter = require('events');
const define = Object.defineProperty;

class Operation extends EventEmitter {

  constructor(){
    super();
    this.steps=0;
  }

  logToTrace(data){
    this.container = require('src/container');
    this.trace = this.container.resolve('Tracelogger');
    this.trace.trace(data);
  }
  logToError(data){
    this.container = require('src/container');
    this.trace = this.container.resolve('Tracelogger');
    this.trace.error(data);
  }

  logStart(data=undefined){

    this.logToTrace(`starting operation ${this.constructor.name}, with input data ${data?typeof data =='string'?data:JSON.stringify(data):'No Data'}`);
  }

  logFinish(data=undefined){
    this.logToTrace(`Ending operation ${this.constructor.name}, with output data : ${data?typeof data =='string'?data:JSON.stringify(data):'No Data'}`);
  }

  logStep({step, data=undefined}){
    this.steps++;


    this.logToTrace(`Operation ${this.constructor.name} | Step ${this.steps} : ${step} , with data : ${data?typeof data =='string'?data:JSON.stringify(data):'No Data'}`);
  }

  logError({error=undefined}){
    this.steps++;
    this.logToError(`Error after step : ${this.steps} in operation ${this.constructor.name}, with error data : ${error?typeof data =='string'?error:JSON.stringify(error):'No Data'}`);
  }


  static setOutputs(outputs) {
    define(this.prototype, 'outputs', {
      value: createOutputs(outputs)
    });
  }

  on(output, handler) {
    if(this.outputs[output]) {
      return this.addListener(output, handler);
    }

    throw new Error(`Invalid output "${output}" to operation ${this.constructor.name}.`);
  }

  execute(){
    this.logStart(arguments);
  }
}

const createOutputs = (outputsArray) => {
  return outputsArray.reduce((obj, output) => {
    obj[output] = output;
    return obj;
  }, Object.create(null));
};

module.exports = Operation;
