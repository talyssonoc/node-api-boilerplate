const path = require('path');
const replace = require('replace-in-file').sync;
const remove = require('del').sync;

const srcPath = path.join(__dirname, '..', 'src');
const testPath = path.join(__dirname, '..', 'test');
const srcAndTestPath = `{${testPath},${srcPath}}`;
const routerPath = path.join(srcPath, 'interfaces', 'http', 'router.js');
const containerPath = path.join(srcPath, 'container.js');

// Remove the references of the files that will be removed

replace({
  files: routerPath,
  from: /\s*apiRouter.*UsersController'\)\);/,
  to: ''
});

replace({
  files: containerPath,
  from: [
    /\s*const.*app\/user'\);/,
    /\s*const.*UsersRepository'\);/,
    /\, User: UserModel/,
    /\s*usersRepository.*\}\]/,
    /\,\s*UserModel/,
    /createUser.*\n/,
    /\s*getAllUsers.*GetAllUsers/,
  ],
  to: ''
});

// Remove example app files

remove([
  path.join(srcAndTestPath, 'app', 'user', '**'),
  path.join(srcAndTestPath, 'domain', 'user', '**'),
  path.join(srcAndTestPath, 'infra', 'user', '**'),
  path.join(srcPath, 'infra', 'database', 'migrate', '*.js'),
  path.join(srcPath, 'infra', 'database', 'seeds', '*.js'),
  path.join(srcPath, 'infra', 'database', 'models', 'User.js'),
  path.join(srcPath, 'interfaces', 'http', 'user', '**'),
  path.join(testPath, 'api', 'users', '**'),
  path.join(testPath, 'support', 'factories', '*.js')
]);

// Remove `cleanup` command from package.json

replace({
  files: path.join(__dirname, '..', 'package.json'),
  from: /\,\s*\"cleanup.*cleanup\.js\"/,
  to: ''
});
