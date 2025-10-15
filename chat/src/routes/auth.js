const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { jwtSecret } = require('../config');

// register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, last_seen: new Date() });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, avatar_url: user.avatar_url }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, avatar_url: user.avatar_url }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
