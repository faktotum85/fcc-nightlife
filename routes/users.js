const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET users listing. */

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

router.get('/logout', (req, res) => {
 req.logout();
 res.redirect('/');
});

module.exports = router;
