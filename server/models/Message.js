const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },  // Channel to which this message belongs
  sender: { type: String, required: true },  // Name of the user who sent the message
  message: { type: String, required: true },  // Content of the message
  createdAt: { type: Date, default: Date.now }  // Timestamp when the message was sent
});

module.exports = mongoose.model('Message', MessageSchema);
