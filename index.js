require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const statusRoutes = require('./routes/status');
const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');
const limiter = require('./middleware/rateLimit');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(bodyParser.json({ strict: false }));
// app.use(limiter);
app.use(express.json());

app.use('/api/v1/', statusRoutes);
app.use('/api/v1/', taskRoutes);
app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));