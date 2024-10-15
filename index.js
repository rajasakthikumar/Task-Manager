const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const CustomError = require('./util/customError');
const taskRoutes = require('./routes/task');
const statusRoutes = require('./routes/status');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
// const commentRoutes = require('./routes/comment');

dotenv.config();

const app = express();
app.use(express.json());


// Mount routes
app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
// app.use('/api', commentRoutes);

app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        CustomError.handleError(err, res);
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

const PORT = process.env.PORT || 3000;
require('./config/db'); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
