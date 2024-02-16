const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const moment = require('moment');
const fs = require('fs/promises');
require('dotenv').config();

const contactsRouter = require('./routes/contactsRouter.js');

const app = express();

app.use(async (req, res, next) => {
  const { method, url } = req;
  const data = moment().format('DD-MM-YYYY_hh:mm:ss');
  await fs.appendFile('./public/server.log', `\n${method} ${url} ${data}`);
  next();
});
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
