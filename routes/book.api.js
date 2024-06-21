const express = require('express');
const { getAllBooks, getBooksByCategory, deleteBook } = require('../controllers/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:categoryId', getBooksByCategory);
router.delete('/:id', deleteBook);

module.exports = router;
