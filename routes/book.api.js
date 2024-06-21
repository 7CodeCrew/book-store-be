const express = require('express');
const { getAllBooks, getBooksByCategory, getBooksByQueryType, getBookDetailById } = require('../controllers/book.controller');
const bookController = require('../controllers/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:categoryId', getBooksByCategory);
router.get('/:queryType', getBooksByQueryType);

router.get('/detail/:id', getBookDetailById)

module.exports = router;
