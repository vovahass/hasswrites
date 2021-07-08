const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const options = { toJSON: { virtuals: true } };

const LiteratureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type:Schema.Types.ObjectId,
        ref:'Image'
    },
    imageCredit: {
        type: String,
        default:'',
        required: false
    },
    body: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default:'',
        required: false
    },
    genre: {
        type: String,
        enum: ['Poem', 'Poem (Youth)', 'Poem (Haiku)', 'Quote', 'Writing Prompt', 'Novel', 'Other'],
        required: true
    },
    quoteBy: {
        type: String,
        default:'',
        required: false
    },
    tags: {
        type: [String],
        required: true
    },
    part: {
        type: Number,
        default: 1,
        min: 1
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    previous_id :{
        type: String,
        default: ''
    },
    next_id: {
        type: String,
        default: ''
    },
    likes: [
        {
            type:Schema.Types.ObjectId, 
            ref:"User"
        }
    ]
},options);

//subsequent deletion middleware
LiteratureSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
});

module.exports = mongoose.model('Literature', LiteratureSchema);
