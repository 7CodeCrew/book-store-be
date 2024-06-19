const express = require('express');
const Router = express.Router();

const authApi = require('./auth.api');
const userApi = require('./user.api');
const bookApi = require('./book.api');
const categoryApi = require('./category.api');

Router.use('/auth', authApi);
Router.use('/user', userApi);
Router.use('/book', bookApi);
Router.use('/category', categoryApi);

module.exports = Router;
