const passport = require('passport');
const url = require('url');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../../models/user');

module.exports = function() {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => {
    User.findOrCreate({twitterId: profile.id }, (err, user) => {
      return done(err, user);
    });
  }));
};
