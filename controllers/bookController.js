const Book = require('../models/bookModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const _ = require('lodash');



// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, price, description, owners } = req.body;
    if (!title || !_.isString(title) || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required and must be a string' });
    }
let doc = { title, author, category, price, description };
if (Array.isArray(owners)) {
  for (let i = 0; i < owners.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(owners[i])) {
      return res.status(400).json({ message: `Invalid owner ID at index ${i}` });
    }
  }
  doc.owners = owners;
}
const newBook = new Book(doc);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//Create Multiple Books 
exports.MultipleInsertBooks = async (req, res) => {
  try {
    const books = req.body;
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of books.' });
    }
for (let i = 0; i < books.length; i++) {
  const { title, author, category, price, description, owners } = books[i];
  if (owners !== undefined) {
    if (!Array.isArray(owners)) {
      return res.status(400).json({ message: `owners must be an array at index ${i}` });
    }
    for (const ownerId of owners) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res.status(400).json({ message: `Invalid owner ID ${ownerId} at index ${i}` });
      }
    }
  }
}
const inserted = await Book.insertMany(books);
res.status(201).json(inserted);
  } catch (error) {
    console.error('Error bulk inserting books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get allbooks
exports.getAllBooks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.author) {
      filter.author = req.query.author;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) {
        const min = parseFloat(req.query.minPrice);
        if (isNaN(min)) {
          return res.status(400).json({ message: 'Invalid minPrice value' });
        }
        priceFilter.$gte = min;
      }
      if (req.query.maxPrice) {
        const max = parseFloat(req.query.maxPrice);
        if (isNaN(max)) {
          return res.status(400).json({ message: 'Invalid maxPrice value' });
        }
        priceFilter.$lte = max;
      }
      filter.price = priceFilter;
    }
    const books = await Book.find(filter);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// get book by ID
exports.getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update book by ID
exports.updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const updates = {};
    if (req.body.title !== undefined) {
      if (!_.isString(req.body.title) || req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Title must be a non-empty string' });
      }
      updates.title = req.body.title;
    }
    if (req.body.author !== undefined) {
      if (!_.isString(req.body.author) || req.body.author.trim() === '') {
        return res.status(400).json({ message: 'Author must be a non-empty string' });
      }
      updates.author = req.body.author;
    }
    if (req.body.category !== undefined) {
      if (!_.isString(req.body.category) || req.body.category.trim() === '') {
        return res.status(400).json({ message: 'Category must be a non-empty string' });
      }
      updates.category = req.body.category;
    }
    if (req.body.price !== undefined) {
      if (!_.isFinite(req.body.price) || req.body.price < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
      }
      updates.price = req.body.price;
    }
    if (req.body.description !== undefined) {
      if (!_.isString(req.body.description) || req.body.description.trim() === '') {
        return res.status(400).json({ message: 'Description must be a non-empty string' });
      }
      updates.description = req.body.description;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};




// Get books by username
exports.getBooksByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const books = await Book.find({ owners: user._id });
    res.json(books);
  } catch (err) {
    console.error('Error fetching books by username:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get books by title
exports.getBooksByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    
    const books = await Book.find({ title });
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found with that title' });
    }
    res.json(books);
  } catch (err) {
    console.error('Error fetching books by title:', err);
    res.status(500).json({ message: 'Server error' });
  }
};