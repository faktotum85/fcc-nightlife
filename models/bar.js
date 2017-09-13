const mongoose = require('mongoose');

const BarSchema = new mongoose.Schema({
  yelpid: String,
  going: [String]
});

const Bar = mongoose.model('Bar', BarSchema);

module.exports = Bar;
