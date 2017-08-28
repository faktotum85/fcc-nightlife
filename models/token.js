const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  access_token: String,
  token_type: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: Number
  }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;
