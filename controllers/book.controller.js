const mongoose = require("mongoose");

const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    const { isbn, title, author, category, publisher } = req.query;
    const condition = { stockStatus: '' };
    if (isbn) condition.isbn = { $regex: isbn, $options: 'i' };
    if (title) condition.title = { $regex: title, $options: 'i' };
    if (author) condition.author = { $regex: author, $options: 'i' };
    if (category) condition.categoryName = { $regex: category, $options: 'i' };
    if (publisher) condition.publisher = { $regex: publisher, $options: 'i' };
    const books = await Book.find(condition);
    res.status(200).json({ status: 'success', books });
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
bookController.getBooksByQueryType = async (req, res) => {
  try {
    const queryType = req.params.queryType;
    // 나중에 검색 기능 대비
    const { title, author } = req.query;
    const condition = { queryType: queryType };
    if (title) condition.title = { $regex: title, $options: 'i' };
    if (author) condition.author = { $regex: author, $options: 'i' };
    const books = await Book.find(condition);

    if (!books) {
      return res.status(404).json({ message: 'No books are found!' });
    }
    return res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};

bookController.getBookDetailById = async(req,res)=>{
  try{
    const id = req.params.id;
    console.log('백엔드에서 디테일 아이디: ', id)
    if (!mongoose.Types.ObjectId.isValid(id)){
      throw new Error("Invalid ID format")
    }
    const book= await Book.findById(id);
    if(!book) throw new Error("No item found");
    res.status(200).json({status: "success", data: book});
  }catch(error){
    return res.status(400).json({status:"fail", error: error.message})
  }
};
module.exports = bookController;
