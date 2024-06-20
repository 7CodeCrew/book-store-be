const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

router.post('/', userController.createUser); //register
router.get('/me', authController.authenticate, userController.getUser);

module.exports = router;