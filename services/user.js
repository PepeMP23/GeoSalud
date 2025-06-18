const User = require('../models/User');

exports.getAll = async () => {
  return await User.find().select('-password');
};

exports.create = async ({ name, username, password }) => {
  const existing = await User.findOne({ username });
  if (existing) throw new Error('El usuario ya existe');

  const newUser = new User({ name, username, password });
  return await newUser.save();
};

exports.update = async (id, { name, username, password }) => {
  return await User.findByIdAndUpdate(id, { name, username, password }, { new: true });
};

exports.remove = async (id) => {
  return await User.findByIdAndDelete(id);
};
