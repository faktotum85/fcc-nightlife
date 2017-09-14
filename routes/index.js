const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bar = require('../models/bar');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Nightlife',
    user: req.user,
    businesses: []
  });
});

router.get('/attend/:business', checkAuth, passport.authenticate('twitter'));

router.get('/users/twitter/callback', function (req, res) {
  passport.authenticate('twitter', function (err, user) {
    req.logIn(user, function(err) {
      return res.redirect(req.session.goBackTo ? req.session.goBackTo : '/');
    });
  })(req, res);
});

function checkAuth(req, res, next) {
  if (!req.user) {
    req.session.goBackTo = req.headers.referer;
    return next();
  }
  // We have a user - skip the authentification and update the bar model
  Bar.findOne({yelpid: req.params.business})
     .then(bar => {
       if (bar) {
         const userIndex = bar.going.indexOf(req.user.twitter.username);
         if (userIndex === -1) {
           // not yet going
           bar.going.push(req.user.twitter.username);
         } else {
           // already going
           bar.going.splice(userIndex, 1);
         }
         return bar.save()
       } else {
         const newBar = new Bar({
           yelpid: req.params.business,
           going: [req.user.twitter.username]
         });
         return newBar.save()
       }
     })
     .then(data => res.redirect(req.headers.referer))
     .catch(err => {
       console.error(err);
       res.redirect(req.headers.referer);
     });
}

module.exports = router;
