'use strict';

import dotenv from 'dotenv'
import express from 'express';
import mediaRoutes from './routes/media.js';

const app = express();

dotenv.config();

app.use('/media', mediaRoutes);


app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
