const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user.model');
const { uploadImage } = require('../utils/cloudinary');

// get profile
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// update profile
router.put('/me', auth, async (req, res) => {
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// upload avatar (base64)
router.post('/me/avatar', auth, async (req, res) => {
  const { image } = req.body; // base64 or data url
  if (!image) return res.status(400).json({ error: 'No image' });
  try {
    const resp = await uploadImage(image);
    const user = await User.findByIdAndUpdate(req.user._id, { avatar_url: resp.secure_url }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
