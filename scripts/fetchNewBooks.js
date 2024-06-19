const axios = require('axios');
const mongoose = require('mongoose');
const Book = require('../models/book');
const dotenv = require('dotenv');

dotenv.config();

async function fetchNewBooks() {
  let page = 1;
  try {
    // 쿼리 별로 도서 불러오기
    await fetchBooks(page, 'ItemNewAll');
    await fetchBooks(page, 'ItemNewSpecial');
    await fetchBooks(page, 'BestSeller');
    await fetchBooks(page, 'BlogBest');

    console.log('Books fetched and saved successfully.');
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// 도서 불러오는 함수 axios call
async function fetchBooks(page, queryType) {
  // 어떤 쿼리가 실행되는지 알기 위한 콘솔 로그
  console.log(queryType);
  // 페이지당 50개씩 나온다. 전체 도서목록을 불러오기 위해서는 페이지가 변수로 들어가서 현재 페이지가 전체 페이지 수보다 작을 경우 계속 axios콜이 실행된다.
  const TTBKEY = process.env.TTBKEY;
  do {
    const response = await axios.get(
      `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${TTBKEY}&QueryType=${queryType}&MaxResults=50&start=${page}&SearchTarget=Book&output=js&Version=20131101`,
    );
    const books = response.data.item;
    totalResults = response.data.totalResults;
    itemsPerPage = response.data.itemsPerPage;

    for (const book of books) {
      const newBook = new Book(book);
      await newBook.save();
    }
    page += 1;
  } while (page < Math.ceil(totalResults / itemsPerPage));
}

module.exports = fetchNewBooks;
