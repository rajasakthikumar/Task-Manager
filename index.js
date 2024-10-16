const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler')

const CustomError = require('./util/customError');
const taskRoutes = require('./routes/task');
const statusRoutes = require('./routes/status');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
// const commentRoutes = require('./routes/comment');
const paymentRoutes = require('./routes/payment');

const seedPermissionsAndRoles = require('./seed');

dotenv.config();

const app = express();
app.use(express.json());


// Mount routes
app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
// app.use('/api', commentRoutes);
app.use('/api/payment',paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await require('./config/db'); 
        await seedPermissionsAndRoles(); 
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();