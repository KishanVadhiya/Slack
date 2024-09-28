const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('941853391466-s45c0ocd24qcc84smpl0mu459flqds0e.apps.googleusercontent.com');
// POST /signup: Create a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// POST /login: Authenticate user and return token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, username: user.username }, 'your_secret_key', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, username: user.username, channels: user.channels });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


// POST /google: Authenticate user using Google OAuth
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '941853391466-s45c0ocd24qcc84smpl0mu459flqds0e.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if the user already exists in your database
    let user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ email, name });
      await user.save();
    }

    // Create your own JWT token (or any other session mechanism)
    const jwtToken = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    // Send token to the client
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Google login failed' });
  }
});

module.exports = router;
