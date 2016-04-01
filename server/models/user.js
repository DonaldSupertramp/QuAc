var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    password: String,
    salt: String,
    token: String,
    email: String
});

module.exports = mongoose.model('User', UserSchema);