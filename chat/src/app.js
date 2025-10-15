const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes');
const { mongoUri } = require('./config');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// connect mongo
mongoose.connect(mongoUri, { dbName: 'chat-app', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

module.exports = app;
