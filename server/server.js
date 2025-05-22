const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, () => {
  console.log('MongoDB connected');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/individuals', require('./routes/individuals'));
app.use('/api/notes', require('./routes/notes'));

app.listen(5000, () => console.log('Server running on port 5000'));
