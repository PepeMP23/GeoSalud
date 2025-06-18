const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
    }
});

PlaceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Place', PlaceSchema);