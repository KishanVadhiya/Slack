const express = require('express');
const Channel = require('../models/Channel');
const User = require('../models/User');
const verifyToken = require('../middleware/auth'); // Import the middleware
const router = express.Router();

// GET /channels: Retrieve all channels for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find the user and populate their channels
    const user = await User.findById(req.user.id).populate('channels');
    res.status(200).json(user.channels);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving channels', error });
  }
});

// POST /channels: Create a new channel
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Create a new channel and add the user to it
    const newChannel = new Channel({ name, users: [user._id] });
    await newChannel.save();

    // Add the channel to the user's list of channels
    user.channels.push(newChannel._id);
    await user.save();

    res.status(201).json({ message: 'Channel created successfully', channel: newChannel });
  } catch (error) {
    res.status(500).json({ message: 'Error creating channel', error });
  }
});

module.exports = router;
