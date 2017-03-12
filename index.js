require('dotenv').load();

const Application = require('src/app/Application');
const server = require('src/app/web/server');
const config = require('config');

const app = new Application({ config, server });

app
  .start()
  .catch((error) => {
    console.error(error);
    process.exit();
  });
