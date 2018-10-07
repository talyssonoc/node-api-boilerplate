const REPL = require('repl')
const vm = require('vm')
const fs = require('fs')

const HISTORY_FILE = '.node_repl_history'

module.exports = {
  start (options = {}) {
    const { expose } = options

    const repl = REPL.start({
      eval: promisableEval

    })

    Object.assign(repl.context, expose)

    try {
      // load command history from a file
      fs.statSync(HISTORY_FILE)
      fs.readFileSync(HISTORY_FILE, { encoding: 'utf8' })
        .split('\n')
        .reverse()
        .filter(line => line.trim())
        .map(line => repl.history.push(line))
    } catch (err) { }
  }
}

function promisableEval (cmd, context, filename, callback) {
  const result = vm.runInContext(cmd, context)

  // write command to history file
  fs.appendFileSync(HISTORY_FILE, cmd)

  if (isPromise(result)) {
    return result
      .then((v) => callback(null, v))
      .catch((e) => callback(e))
  }

  return callback(null, result)
}

function isPromise (value) {
  return value &&
    (typeof value.then === 'function') &&
    (typeof value.catch === 'function')
}
