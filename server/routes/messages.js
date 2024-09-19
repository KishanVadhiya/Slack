const express = require('express');
const Message = require('../models/Message');
const Channel = require('../models/Channel'); // Import Channel to check access
const verifyToken = require('../middleware/auth'); // Import the middleware
const router = express.Router();

// GET /channels/:channelId/messages: Retrieve all messages for a specific channel
router.get('/:channelId/messages', verifyToken, async (req, res) => {
  try {
    const { channelId } = req.params;

    // Find the channel to check if the user has access
    const channel = await Channel.findById(channelId);
    if (!channel || !channel.users.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. You are not part of this channel.' });
    }

    // If user is part of the channel, retrieve messages
    const messages = await Message.find({ channelId }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
});

// POST /channels/:channelId/messages: Post a new message to a specific channel
router.post('/:channelId/messages', verifyToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { message } = req.body;

    // Find the channel to check if the user has access
    const channel = await Channel.findById(channelId);
    if (!channel || !channel.users.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. You are not part of this channel.' });
    }

    // If user is part of the channel, post the new message
    const newMessage = new Message({
      channelId,
      sender: req.user.username,
      message,
    });
    await newMessage.save();

    res.status(201).json({ message: 'Message posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error posting message', error });
  }
});

module.exports = router;
