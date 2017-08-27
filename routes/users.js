const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET users listing. */

module.exports = function(passport) {

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/twitter', passport.authenticate('twitter'));

  router.get('/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
                                       failureRedirect: '/login' }));

  return router;
}
