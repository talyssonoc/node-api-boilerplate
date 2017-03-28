# Node API boiletplate

It's an opinionated boilerplate for Node web APIs focused on separation of concerns and scalability.

## Features

<dl>
  <dt>Multilayer folder structure</dt>
  <dd>
    Code organization inspired by <a href="http://dddcommunity.org/">DDD</a> and <a href="https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html">Clean Architecture</a>
  </dd>

  <dt>Instant feedback</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/nodemon">Nodemon</a> to automatically reload the server after a file change when on development mode, makes the development faster and easier.
  </dd>

  <dt>Ready for production</dt>
  <dd>
    Setup with <a href="https://www.npmjs.com/package/pm2">PM2</a> process manager ready to go live on production. If you use Heroku there's also a Procfile and a post-build task to run the migrations on production.
  </dd>

  <dt>Scalable and easy to use web server</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/express">Express</a> for requests routing and middlewares. There are some essential middlewares for web APIs already setup, like <a href="https://www.npmjs.com/package/body-parser">body-parser</a>, <a href="https://www.npmjs.com/package/compression">compression</a>, <a href="https://www.npmjs.com/package/cors">CORS</a> and <a href="https://www.npmjs.com/package/method-override">method-override</a>.
  </dd>

  <dt>Database integration</dt>
  <dd>
    <a href="https://www.npmjs.com/package/sequelize">Sequelize</a>, an ORM for SQL databases, is already integrated, you just have to set the authentication configurations.
  </dd>

  <dt>Prepared for testing</dt>
  <dd>
    The test suite uses <a href="https://www.npmjs.com/package/mocha">Mocha</a>/<a href="https://www.npmjs.com/package/chai">Chai</a> and is prepared to run unit, integration and functional tests right from the beginning. There are helpers to make it easy to make requests to the web app during the tests and for cleaning the database after each test. A <a href="https://www.npmjs.com/package/factory-girl">FactoryGirl</a> adapter for Sequelize is setup as well to make your tests DRY, and the tests generate code coverage measurement with <a href="https://www.npmjs.com/package/istanbul">Istanbul</a>.
  </dd>

  <dt>Dependency injection</dt>
  <dd>
    With <a href="https://www.npmjs.com/package/awilix">Awilix</a>, a practical dependency injection library, the code will not be coupled and it'll still be easy to resolve automatically the dependencies on the runtime and mock them during the tests. It's even possible inject dependencies on your controllers with the <a href="https://www.npmjs.com/package/awilix-express">Awilix Express adapter</a>.
  </dd>

  <dt>CLI integration</dt>
  <dd>
    Both the application and Sequelize have command-line tools to make it easy to work with them. Check the <a href="#scripts">Scripts</a> section to know more about this feature.
  </dd>

  <dt>Logging</dt>
  <dd>
    The <a href="https://www.npmjs.com/package/log4js">Log4js</a> logger is highly pluggable, being able to append the messages to a file during the development and send them to a logging service when on production. Even the requests (through <a href="https://www.npmjs.com/package/morgan">morgan</a>) and queries will be logged.
  </dd>

  <dt>Linter</dt>
  <dd>
    It's also setup with <a href="https://www.npmjs.com/package/eslint">ESLint</a> to make it easy to ensure a code styling and find code smells.
  </dd>
</dl>

## Quick start

_Notice that the boilerplate comes with a small application for user management already, you can delete it after you understand how the boilerplate works but please do the quick start first!_ 😊

1. Clone the repository with `git clone --depth=1 https://github.com/talyssonoc/node-api-boilerplate`
2. Setup the database on `config/database.js` (there's an example file there to be used with PostgreSQL 😉 )
3. Install the dependencies with `yarn` (click here if you [don't have Yarn installed](https://yarnpkg.com/docs/install))
4. Create the development and test databases you have setup on `config/database.js`
5. Run the database migrations with `npm run sequelize db:migrate`
6. Add some seed data to the development database with `npm run sequelize db:seed:all`
7. Run the application in development mode with `npm run dev`
8. Access `http://localhost:3000/api/users` and you're ready to go!

## Aditional info:

- Don't forget to run the migrations for the test environment as well (including when you create a new migration) with `npm run sequelize db:migrate -- --env=test`

## Scripts

This boilerplate comes with a collection of npm scripts to make your life easier, you'll run them with `npm run <script name>`:

- `dev`: Open the application in development mode
- `start` Open the application ready to production (prefer not to do that in development) 
- `test`: Run the test suite
- `coverage`: Run the test suite and generate code coverage, the output will be on `coverage` folder
- `lint`: Run the linter
- `sequelize`: Alias to use the [Sequelize CLI](https://github.com/sequelize/cli)
- `console`: Open a pre-built console, you can access the DI container through the `container` variable once it's open, the console is promise-friendly 

## Tech

- [Node v6+](http://nodejs.org/)
- [Express](https://npmjs.com/package/express)
- [Sequelize](https://www.npmjs.com/package/sequelize)
- [Awilix](https://www.npmjs.com/package/awilix)
- [Structure](https://www.npmjs.com/package/structure)
- [HTTP Status](https://www.npmjs.com/package/http-status)
- [Log4js](https://www.npmjs.com/package/log4js)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Express Status Monitor](https://www.npmjs.com/package/express-status-monitor)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [PM2](https://www.npmjs.com/package/pm2)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Chai](https://www.npmjs.com/package/chai)
- [FactoryGirl](https://www.npmjs.com/package/factory-girl)
- [Istanbul](https://www.npmjs.com/package/istanbul)
- [ESLint](https://www.npmjs.com/package/eslint)

## Disclaimer and contributing

It's the first version of the documentation of this boilerplate, feel free to contribute to it.
