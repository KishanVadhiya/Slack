const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the channel
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs that are part of the channel
  createdAt: { type: Date, default: Date.now }  // Timestamp when the channel was created
});

module.exports = mongoose.model('Channel', ChannelSchema);
