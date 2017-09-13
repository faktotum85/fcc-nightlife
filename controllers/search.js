const request = require('request');
const async = require('async');
const Token = require('../models/token');
const Bar = require('../models/bar');

module.exports = (req, res) => {

  Token.findOne({}, (err, token) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    if (!token) {
      console.log(`no token - fetching one`);
      return getToken(req, res, fetchResults);
    } else {
      return fetchResults(token, req, res, false);
    }
  });
};

function fetchResults(token, req, res, giveUp) {
  request.get({
    url: 'https://api.yelp.com/v3/businesses/search',
    headers: {
      'Authorization' : 'Bearer ' + token.access_token
    },
    qs: {
      location: req.query.location || 'New York',
      term: 'Bar'
    }
  }, (err, response, body) => {
    if (err) {
      console.error(err);
      return res.render('index', {
        title: `Nightlife in ${req.query.location}`,
        user: req.user,
        results: []
      });
    } else if (JSON.parse(body).error) {
      if (giveUp) {
        console.log('giving up');
        return res.sendStatus(500);
      } else {
        console.log(`token didn't work`);
        token.remove((err) =>{
          if (err) {
            return res.sendStatus(500);
          } else {
            console.log('deleted the old one - fetching new one');
            return getToken(req, res, fetchResults);
          }
        });
      }
    } else {
      let businesses = JSON.parse(body).businesses.map(business => {
        return {
          id: business.id,
          name: business.name,
          image_url: business.image_url,
          rating: business.rating,
          review_count: business.review_count,
          price: business.price
        }
      });
      async.map(businesses, appendCount.bind(null, req.user), (err, results) => {
        return res.render('index', {
          title: `Nightlife in ${req.query.location}`,
          user: req.user,
          businesses: results
        });
      });
    }
  });
}

function appendCount(user, item, callback) {
  Bar.findOne({yelpid: item.id}, (err, bar) => {
    item.going = bar ? bar.going : [];
    item.meGoing = user && item.going.indexOf(user.twitter.username) > -1;
    return callback(null, item);
  });
}

function getToken(req, res, callback) {
  request
    .post('https://api.yelp.com/oauth2/token', {form: {
      grant_type: 'client_credentials',
      client_id: process.env.YELP_ID,
      client_secret: process.env.YELP_SECRET
    }}, (err, response, body) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      } else {
        const newToken = new Token(JSON.parse(body));
        newToken.createdAt.expires = body.expires_in;
        newToken.save((err, token) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          } else {
            return callback(token, req, res, true);
          }
        });
      }
    });
}
