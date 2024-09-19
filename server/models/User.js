const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Unique username for each user
  password: { type: String, required: true },  // Hashed password
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }]  // Array of channel IDs user is part of
});

module.exports = mongoose.model('User', UserSchema);
