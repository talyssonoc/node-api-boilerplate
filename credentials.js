/* eslint-disable import/no-dynamic-require */
let credentials;
const credentialsPath = './credentials.json';


if (require('fs').existsSync(credentialsPath)) {
  credentials = require(credentialsPath);
} else {
  credentials = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,
  };
}

module.exports = credentials;
