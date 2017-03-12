const EventEmitter = require('events');

class Operation extends EventEmitter {
  static setOutputs(outputs) {
    this.prototype.outputs = outputs;

    outputs.forEach((output) => {
      this.prototype[output] = output;
    });
  }

  on(output, handler) {
    if(this.outputs.indexOf(output) > -1) {
      return this.addListener(output, handler);
    }

    throw new Error(`Invalid output "${output}" to operation ${this.constructor.name}.`);
  }
}

module.exports = Operation;
