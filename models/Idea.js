const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for mongoose (establishes the model for the route)
const IdeaSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    details: {
        type: String, 
        required: true
    }, 
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// Create our model
mongoose.model('ideas', IdeaSchema);