const mongoose = require('mongoose');

const oemSchemas = new mongoose.Schema({
  

  image: {
    data: Buffer,
    contentType: String,
  },
  make: String,
  model: String,
  year: Number,
  listPrice: Number,
  colors: [String],
  mileage: Number,
  power: Number,
  maxSpeed: Number
});

module.exports = mongoose.model('oemSchema', oemSchemas);

