const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/task');
const statusRoutes = require('./routes/status');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.DBURI ) .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
});