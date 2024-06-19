const express = require('express');
const { getAllBooks } = require('../controller/book.controller');

const router = express.Router();

router.get('/', getAllBooks);

module.exports = router;
