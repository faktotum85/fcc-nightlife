const request = require('request');
const Token = require('../models/token');

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
      console.log(`using existing token`);
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
    }
    if (JSON.parse(body).error) {
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
      return res.send(body);
    }
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
