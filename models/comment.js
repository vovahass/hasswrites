const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    number: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Comment', CommentSchema);