const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  twitterId: String
});

UserSchema.statics.findOrCreate = (query, done) => {
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

const User = mongoose.model('User', UserSchema);

module.exports = User;
