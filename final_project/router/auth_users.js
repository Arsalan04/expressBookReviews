const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // returns boolean
    let user = users.find(u => u.username === username);
    return !user;
  }
  
  const authenticatedUser = (username, password) => { // returns boolean
    let user = users.find(u => u.username === username && u.password === password);
      return user ? true : false;
  }

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
  
    const accessToken = jwt.sign(
      { username: username },
      "access",
      { expiresIn: "1h" }
    );
  
    req.session.authorization = {
      accessToken: accessToken
    };
  
    return res.status(200).json({ message: "User successfully logged in" });
  
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review text required" });
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
      });
    }
  
    return res.status(404).json({ message: "No review found for this user" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
