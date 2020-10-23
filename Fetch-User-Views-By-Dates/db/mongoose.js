
const mongoose = require('mongoose')

const connectMongoDB = async () => {

    try {

        const conn = await mongoose.connect(process.env.MONGODB_SERVER_LOCATION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    
        // Note: Log the connection host
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (err) {
        console.error(err);
    }

}

module.exports = connectMongoDB