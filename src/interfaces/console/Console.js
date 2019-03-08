const REPL = require('repl');
const vm = require('vm');

function isPromise(value) {
  return value
  && (typeof value.then === 'function')
  && (typeof value.catch === 'function');
}


function promisableEval(cmd, context, filename, callback) {
  const result = vm.runInContext(cmd, context);

  if (isPromise(result)) {
    return result
      .then(v => callback(null, v))
      .catch(e => callback(e));
  }

  return callback(null, result);
}

module.exports = {
  start(options = {}) {
    const { expose } = options;

    const repl = REPL.start({
      eval: promisableEval,
    });

    Object.assign(repl.context, expose);
  },
};

