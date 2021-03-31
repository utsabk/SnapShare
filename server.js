'use strict';

import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import localhost from './localhost.js'
import production from './production.js'

const app = express();


// before routes; otherwise middleware didn't get called
if (process.env.NODE_ENV === 'production') {
  production(app,process.env.PORT)
} else {  
  localhost(app,process.env.HTTP_PORT,process.env.HTTPS_PORT)
}

app.use(cors())
app.use(helmet())
app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);
app.use('/comment', commentRoutes);
app.use('/user', userRoutes);

