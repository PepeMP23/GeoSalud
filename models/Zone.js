const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  shape: {
    type: [[Number]], 
    required: true
  }
});

module.exports = mongoose.model('Zone', ZoneSchema);
