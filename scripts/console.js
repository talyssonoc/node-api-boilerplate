const REPL = require('repl');
const vm = require('vm');
const db = require('../src/infra/database/models');

const repl = REPL.start({
  eval: promisableEval
});

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

Object.assign(repl.context, { db });
