var mongoose = require('mongoose');

//SCHEMA SETUP
var feedSchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "https://images.unsplash.com/photo-1523582407565-efee5cf4a353?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    description: { type: String, default: "sorry no description!" },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    type: String,
    created: { type: Date, default: Date.now },
    highlights: { type: String, default: "It does not do to dwell on your dreams." }
},
    { usePushEach: true });

module.exports = mongoose.model('Feed', feedSchema);