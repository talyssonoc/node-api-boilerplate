const REPL = require('repl');
const vm = require('vm');

module.exports = {
  start(options = {}) {
    const { expose, socket } = options;
    const repl = REPL.start({
      eval: promisableEval,
      terminal:true,
      input: socket,
      output: socket,
    });

    Object.assign(repl.context, expose);
  }
};


function promisableEval(cmd, context, filename, callback) {
  const result = vm.runInContext(cmd, context);

  if(isPromise(result)) {
    return result
      .then((v) => callback(null, v))
      .catch((e) => callback(e));
  }

  return callback(null, result);
}

function isPromise(value) {
  return value
  && (typeof value.then === 'function')
  && (typeof value.catch === 'function');
}
