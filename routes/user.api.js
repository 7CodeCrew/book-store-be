const express = require('express');
const router = express.Router();

const authController = require('../controllers/user.controller');
const userController = require('../controllers/user.controller');

router.post('/', userController.createUser); //register

module.exports = router;
