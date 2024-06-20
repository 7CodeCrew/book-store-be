const express = require('express');
const { getAllBooks, getBooksByCategory, getBooksByQueryType } = require('../controllers/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:categoryId', getBooksByCategory);
router.get('/:queryType', getBooksByQueryType);

module.exports = router;
