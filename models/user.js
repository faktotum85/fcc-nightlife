const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  twitter: {
    id: String,
    username: String,
    displayName: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
