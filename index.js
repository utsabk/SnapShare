'use strict';

import 'dotenv/config.js';
import express from 'express';
import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //explicitly set the directory where templates are stored

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);
app.use('/comment', commentRoutes);

app.get('/', (req, res) => res.render('signin'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/signin', (req, res) => res.render('signin'));
app.get('/upload', (req, res) => res.render('upload'));

// app.get('*', (req, res) => {
//   console.log(req.pathname);
//   const url = req.url.split('/')
//   res.render(url[1])
// })

app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
