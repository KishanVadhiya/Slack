const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true },  // Unique username for each user
  password: { type: String, required: false },  // Hashed password
  name: { type: String, required: true },  // Name of the user
  email: { type: String, required: true, unique: true },  // Unique email for each
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }]  // Array of channel IDs user is part of
});

module.exports = mongoose.model('User', UserSchema);
