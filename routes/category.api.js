const express = require('express');
const { getAllCategories } = require('../controller/category.controller');

const router = express.Router();

router.get('/', getAllCategories);

module.exports = router;
