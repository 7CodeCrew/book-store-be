const express = require('express');
const { getAllBooks, getBooksByCategory } = require('../controller/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:categoryID', getBooksByCategory);

module.exports = router;
