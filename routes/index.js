const express = require('express');
const Router = express.Router();

const authApi = require('./auth.api');
const userApi = require('./user.api');
const bookApi = require('./book.api');
const categoryApi = require('./category.api');
const cartApi = require('./cart.api');

Router.use('/auth', authApi);
Router.use('/user', userApi);
Router.use('/book', bookApi);
Router.use('/category', categoryApi);
Router.use('/cart', cartApi);

module.exports = Router;
