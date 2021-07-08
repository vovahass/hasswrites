const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    likedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref:'Literature'
        }
    ],
    textColor: {
        type: String,
        required: true
    },
    commentBoxTheme: {
        type: String,
        enum:['light','dark'],
        required: true
    },
    uniqueNumber: {
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum: ['normal', 'banned'],
        default: 'normal'
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);