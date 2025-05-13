const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());


app.use('/api/users', userRoutes);

app.use('/api/books', bookRoutes);

app.get('/', (req, res) => res.send('Welcome to the Bookstore API'));

module.exports = app;
