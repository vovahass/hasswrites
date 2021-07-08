const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

module.exports = mongoose.model('Image', ImageSchema);