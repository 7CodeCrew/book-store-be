const express = require('express');
const Router = express.Router();

const authApi = require('./auth.api');
const userApi = require('./user.api');

Router.use('/auth', authApi);
Router.use('/user', userApi);

module.exports = Router;
