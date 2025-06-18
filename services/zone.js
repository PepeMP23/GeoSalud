const Zone = require('../models/Zone');

exports.getAll = async (name = '') => {
  const filter = name ? { name: new RegExp(name, 'i') } : {};
  return await Zone.find(filter);
};

exports.create = async ({ name, description, shape }) => {
  const zone = new Zone({ name, description, shape });
  return await zone.save();
};

exports.update = async (id, { name, description }) => {
  return await Zone.findByIdAndUpdate(id, { name, description }, { new: true });
};

exports.remove = async (id) => {
  return await Zone.findByIdAndDelete(id);
};
