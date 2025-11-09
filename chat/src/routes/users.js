import express from 'express';
import User from '../models/user.model.js';
import APIError from '../utils/apiError.js';

const router = express.Router();

// Helper: parse composite user_id like "CLIENT1762181100850" or "ADMIN_12345"
function parseCompositeUserId(id) {
  if (!id || typeof id !== 'string') return null;
  // try common patterns: LETTERS + optional sep + DIGITS
  const m = id.match(/^([A-Za-z]+)[_\-]?(\d+)$/);
  if (m) return { prefix: m[1].toUpperCase(), numericId: m[2], original: id };
  // fallback: letters prefix + rest
  const m2 = id.match(/^([A-Za-z]+)(.+)$/);
  if (m2) return { prefix: m2[1].toUpperCase(), suffix: m2[2], numericId: null, original: id };
  // no prefix detected
  return { prefix: null, suffix: id, original: id };
}

// Tạo user mới
router.post('/create', async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return next(new APIError('user_id is required', 400));
    }

    const parsed = parseCompositeUserId(user_id);

    // role: ưu tiên role truyền vào, nếu không có -> lấy từ prefix parse được
    const role = parsed.prefix;

    // username: nếu không truyền thì tạo mặc định từ role + numericId (nếu có)
    let username = req.body.username;
    if (!username) {
      if (parsed.numericId) username = `${role || 'USER'}${parsed.numericId}`;
      else username = `${role || 'USER'}_${parsed.original}`;
    }

    if (!role) {
      return next(new APIError('role cannot be determined from user_id; provide role explicitly', 400));
    }

    await User.create({ user_id: parsed.original, role, username });
    res.status(201).json({ status: 'success', data: { user_id: parsed.original, role, username } });
  } catch (err) {
    next(err);
  }
});

export default router;