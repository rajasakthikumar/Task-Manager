
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.DBURI, {
        autoIndex: true,
        dbName: "Status",
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

module.exports = connectDB;