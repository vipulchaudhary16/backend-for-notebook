import mongoose from 'mongoose';
const { Schema } = mongoose;

//creating schemas for storing note
const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default : "general"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('user', NotesSchema)