const ssm = require('./utils/ssm');

module.exports = async (env) => {
  if (env === 'production' || env === 'staging') {
    const stage = process.env.APPLICATION_STAGE || 'staging';
    process.env.AWS_REGION = 'us-east-1';

    if (stage) {
      const options = {
        Path: `/${stage}`,
        WithDecryption: true,
        target: process.env,
      };

      await ssm(options);
      console.log(`Environment successfully loaded from ${stage}`); // eslint-disable-line
    } else {
      const errMessage = `
        APPLICATION_STAGE is undefined or empty.

        On system initialization this variable
        must be defined with SSM defined prefix.

        Variables should be defined within
        a path to be correctly loaded
      `;
      throw new Error(errMessage);
    }
  } else {
    console.log(`Using ${env} environment from docker-compose...`); // eslint-disable-line
  }
};
