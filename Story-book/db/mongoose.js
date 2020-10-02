
const mongoose = require('mongoose')

const connectMongoDB = async () => {

    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // Note: Log the connection host
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(error);
    }

}

module.exports = connectMongoDB