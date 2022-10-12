var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    fullName: String,
    password: String,
    email: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);