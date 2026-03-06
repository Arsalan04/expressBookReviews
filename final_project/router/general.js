const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password required" });
    }
  
    if (!isValid(username)) {
      return res.status(409).json({ message: "User already exists!" });
    }
  
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
  
    getBooks.then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: "Error fetching books" });
    });
  
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;
  
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });
  
    getBook.then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
  
  });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
  
      const filtered_books = Object.values(books).filter(
        book => book.author === author
      );
  
      resolve(filtered_books);
  
    });
  
    getBooksByAuthor.then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: "Error fetching books by author" });
    });
  
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
  
      const filtered_books = Object.values(books).filter(
        book => book.title === title
      );
  
      resolve(filtered_books);
  
    });
  
    getBooksByTitle.then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: "Error fetching books by title" });
    });
  
  });

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
