//if type is module
//import mongoose from 'mongoose';

const mongoose = require('mongoose')
const { Schema } = mongoose;

//creating schemas for unique user login
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;