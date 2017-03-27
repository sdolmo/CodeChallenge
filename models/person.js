var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect("mongodb://localhost/people");

autoIncrement.initialize(connection);

var personSchema = new mongoose.Schema({
  name: String,
  favoriteCity: String
});

personSchema.plugin(autoIncrement.plugin, {
  model: 'Person',
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model('Person', personSchema);
