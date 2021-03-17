'use strict';

import 'dotenv/config.js';
import express from 'express';
import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/authRoutes.js';
const app = express();

app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.render('upload'));

app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
