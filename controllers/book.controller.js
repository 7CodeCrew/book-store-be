const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    // 나중에 검색 기능 대비
    const { name } = req.query;
    const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    let query = Book.find(cond);
    let response = { status: 'success' };

    const books = await query.exec();
    response.data = books;
    if (!books) {
      return res.status(404).json({ message: 'No books are found!' });
    }
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};

bookController.getBooksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // 나중에 검색 기능 대비
    const { name } = req.query;
    const cond = name ? { categoryId: categoryId, name: { $regex: name, $options: 'i' } } : { categoryId: categoryId };
    console.log(cond);
    let query = Category.find(cond).populate({
      path: 'books',
      populate: {
        path: 'bookId',
        model: 'Book',
      },
    });
    let response = { status: 'success' };

    const books = await query.exec();
    response.data = books;
    if (!books) {
      return res.status(404).json({ message: 'No books are found!' });
    }
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};

module.exports = bookController;
