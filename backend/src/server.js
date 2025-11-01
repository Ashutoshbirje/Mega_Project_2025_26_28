const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectdb = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

connectdb();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));