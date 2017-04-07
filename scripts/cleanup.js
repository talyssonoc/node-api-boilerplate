const path = require('path');
const replace = require('replace-in-file').sync;
const remove = require('rimraf');

const srcPath = path.join(__dirname, '..', 'src');

const routerPath = path.join(srcPath, 'interfaces', 'http', 'router.js');
const containerPath = path.join(srcPath, 'container.js');

// replace({
//   files: routerPath,
//   from: /\s*apiRouter.*UsersController'\)\);/,
//   to: ''
// });

// replace({
//   files: containerPath,
//   from: [
//     /\s*const.*app\/user'\);/,
//     /\s*const.*UsersRepository'\);/,
//     /\s*const.*database\/models'\);/,
//     /\s*usersRepository.*\}\]/,
//     /\,\s*UserModel/,
//     /createUser.*\n/,
//     /\s*getAllUsers.*GetAllUsers/,
//   ],
//   to: ''
// });
