require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_blockchain';

// Start HTTP server immediately so non-DB endpoints (e.g., status checks) work
app.listen(PORT, () => console.log('Server running on port', PORT));

// Connect to MongoDB with retry (non-blocking)
const connectWithRetry = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('Mongo connection error:', err && err.message ? err.message : err);
    const retryMs = Number(process.env.MONGO_RETRY_MS || 5000);
    console.log(`Retrying MongoDB connection in ${retryMs}ms...`);
    setTimeout(connectWithRetry, retryMs);
  });
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

connectWithRetry();