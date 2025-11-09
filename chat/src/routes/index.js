import express from 'express';
import conversationRouter from './conversations.js';
import messageRouter from './messages.js';
import userRouter from './users.js';

const router = express.Router();

router.use('/conversations', conversationRouter);
router.use('/messages', messageRouter);
router.use('/users', userRouter);

export default router;
