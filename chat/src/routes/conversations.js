const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

// create direct (or reuse existing)
router.post('/direct', auth, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    // try find existing conversation between two users
    const existing = await Conversation.findOne({ type: 'direct', participants: { $all: [req.user._id, userId] } });
    if (existing) return res.json(existing);
    const conv = await Conversation.create({ type: 'direct', participants: [req.user._id, userId] });
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// create group
router.post('/group', auth, async (req, res) => {
  const { name, code } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const conv = await Conversation.create({ type: 'group', name, code, participants: [req.user._id], admins: [req.user._id] });
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// request join group
router.post('/:id/request', auth, async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Not found' });
    if (conv.participants.includes(req.user._id)) return res.status(400).json({ error: 'Already a member' });
    if (conv.requests.includes(req.user._id)) return res.status(400).json({ error: 'Already requested' });
    conv.requests.push(req.user._id);
    await conv.save();
    // TODO: notify admins via socket
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// admin accept request
router.post('/:id/approve', auth, async (req, res) => {
  const { userId } = req.body;
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Not found' });
    if (!conv.admins.map(a => a.toString()).includes(req.user._id.toString())) return res.status(403).json({ error: 'Not admin' });
    // remove from requests and add to participants
    conv.requests = conv.requests.filter(r => r.toString() !== userId.toString());
    if (!conv.participants.map(p => p.toString()).includes(userId.toString())) conv.participants.push(userId);
    await conv.save();
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// list conversations for user
router.get('/', auth, async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.user._id }).populate('last_message').sort({ updatedAt: -1 });
    res.json(convs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
