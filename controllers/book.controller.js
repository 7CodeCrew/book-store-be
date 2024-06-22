const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    const { isbn, title, author, publisher } = req.query;
    const condition = { deleted: { $ne: true } };
    if (isbn) condition.isbn = { $regex: isbn, $options: 'i' };
    if (title) condition.title = { $regex: title, $options: 'i' };
    if (author) condition.author = { $regex: author, $options: 'i' };
    if (publisher) condition.publisher = { $regex: publisher, $options: 'i' };
    const books = await Book.find(condition);
    res.status(200).json({ status: 'success', books });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndUpdate(bookId, { deleted: true }, { new: true });
    if (!book) throw new Error('도서 상품을 찾을 수 없습니다.');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.addBook = async (req, res) => {
  try {
    const { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus } =
      req.body;
    const book = new Book({
      isbn,
      title,
      author,
      categoryName,
      publisher,
      cover,
      description,
      priceStandard,
      priceSales,
      stockStatus,
    });
    await book.save();
    res.status(200).json({ status: 'success', book });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus } =
      req.body;
    const book = await Book.findByIdAndUpdate(
      bookId,
      { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus },
      { new: true },
    );
    if (!book) throw new Error('도서 상품을 찾을 수 없습니다.');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
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
