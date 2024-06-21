const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

router.post('/', userController.createUser); //register
router.get('/me', authController.authenticate, userController.getUser);

// admin user만
router.get('/admin', authController.authenticate, authController.checkAdminPermission, userController.getAllAdmin);

// all users
router.get('/all', authController.authenticate, authController.checkAdminPermission, userController.getAllUsers);

module.exports = router;
