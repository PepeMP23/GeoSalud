const Place = require('../models/Place');

exports.getAll = async (name = '') => {
  const filter = name ? { name: new RegExp(name, 'i') } : {};
  return await Place.find(filter);
};

exports.create = async ({ name, description, latitude, longitude }) => {
  const place = new Place({
    name,
    description,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  });
  return await place.save();
};

exports.update = async (id, { name, description }) => {
  return await Place.findByIdAndUpdate(id, { name, description }, { new: true });
};

exports.remove = async (id) => {
  return await Place.findByIdAndDelete(id);
};
