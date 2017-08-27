const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  twitterId: String
});

UserSchema.statics.findOrCreate = (query, done) => {
  User.findOne(query, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      const newUser = new User(query);
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        return done(null, newUser);
      });
    } else {
      return done(null, user);
    }
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
