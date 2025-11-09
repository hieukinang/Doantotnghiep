import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { mongoUri } from './config.js';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// connect mongo
mongoose.connect(mongoUri, { dbName: 'chat-app', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

// Middleware xử lý lỗi trả về JSON
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

export default app;
