const { scopePerRequest } = require('awilix-express');
const container = require('../container');
const controller = require('./createControllerRoute');

const router = require('express').Router();

router.use(scopePerRequest(container));

router.use('/users', controller('user/UsersController'));

module.exports = router;
