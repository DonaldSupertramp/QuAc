var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DocumentSchema = new Schema({
    author: String,
    category: String,
    title: String,
    isPublic: Boolean,
    content: String,
    date: Date
});

module.exports = mongoose.model('Document', DocumentSchema);