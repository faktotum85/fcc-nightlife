var express = require('express');
var router = express.Router();
const search = require('../controllers/search');

/* GET home page. */
router.get('/', search);

module.exports = router;
