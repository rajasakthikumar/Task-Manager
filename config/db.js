
const mongoose = require('mongoose');


const connectDB = async () => {
    console.log(process.env.DBURI)
    try {
    const conn = await mongoose.connect(process.env.DBURI, {
        autoIndex: true,
        dbName: process.env.MONGO_DATABASE_NAME,
        retryWrites: true,
        w:process.env.DB_W,
        appName: process.env.DB_APPNAME,

    });

    if (conn) {
        console.log(`MongoDB Connected: ${conn.connection.host} with Database : ${process.env.MONGO_DATABASE_NAME}`);
    }

} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}
}

connectDB()

module.exports = connectDB;