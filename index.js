'use strict';

import 'dotenv/config.js';
import express from 'express';
import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
const app = express();

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);
app.use('/comment', commentRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
