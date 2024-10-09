const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/task');
const statusRoutes = require('./routes/status');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const commentRoutes = require('./routes/comment');

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Mount routes
app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api', commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
require('./config/db'); // Ensure DB is connected

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
