'use strict';

import dotenv from 'dotenv'
import express from 'express';
import postRoutes from './routes/post.js';
import pool from './db/databse.js';

const app = express();

dotenv.config();

app.use('/post', postRoutes);


app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
