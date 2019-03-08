const SsmParams = require('ssm-params');

module.exports = options => new Promise((resolve, reject) => {
  SsmParams.ssmToObjByPath(options, (err) => {
    if (err) {
      console.log('Error in SSM', err); // eslint-disable-line
      reject();
    } else {
      console.log(`Environment correctly loaded from ${options.Path}...`); // eslint-disable-line
      resolve();
    }
  });
});
