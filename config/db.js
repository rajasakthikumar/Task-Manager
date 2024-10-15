// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.DBURI;

if (!uri) {
  throw new Error(' Make sure DBURI is not defined.');
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err =>
    console.error('Error connecting to MongoDB:', err)
  );
