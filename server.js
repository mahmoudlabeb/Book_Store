const connectDB = require('./config/db');
const app = require('./book_store');

const PORT =  3000;
connectDB()
  .then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })

  .catch(err => console.error('Failed to start server:', err));
