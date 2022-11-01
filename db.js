const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
     mongoose.connect(mongoURI,  () =>  {
        console.log("Connected to mongo")
    })
}

module.exports = connectToMongo;