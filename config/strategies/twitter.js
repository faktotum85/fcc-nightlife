const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../../models/user');

module.exports = function() {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
  },
  (token, tokenSecret, profile, done) => {
    User.findOne({'twitter.id': profile.id}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        const newUser = new User();
        newUser.twitter.id = profile.id;
        newUser.twitter.username = profile.username;
        newUser.twitter.displayName = profile.displayName;

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
  }));
};
