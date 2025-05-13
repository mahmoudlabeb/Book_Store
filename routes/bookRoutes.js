const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');



router.get('/user/:username', bookController.getBooksByUsername);
router.post('/bulk', bookController.MultipleInsertBooks);
router.get('/title/:title', bookController.getBooksByTitle);
router.post('/',    bookController.createBook);
router.get('/',     bookController.getAllBooks);
router.get('/:id',  bookController.getBookById);
router.put('/:id',  bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
