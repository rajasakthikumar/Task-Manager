const express = require('express');
const statusRoutes = require('./routes/status');
const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');
const limiter = require('./middleware/rateLimit');

const app = express();
app.use(limiter);
app.use(express.json());

app.use('/api', statusRoutes);
app.use('/api', taskRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));