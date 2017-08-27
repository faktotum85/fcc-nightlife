const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  twitterId: String
});

const User = mongoose.model('User', userSchema);

User.statics.findOrCreate = (query, done) => {
  User.find(query, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User(query);
      user.save((err) => {
        if (err) {
          return done(err);
        }
        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}

module.exports = User;
