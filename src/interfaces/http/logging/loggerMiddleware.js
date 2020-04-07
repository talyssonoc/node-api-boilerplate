const morgan = require('morgan');

module.exports = () => morgan('combined', {
  skip: req => req.path.match(/status$/) || req.path.match(/favicon/),
});
