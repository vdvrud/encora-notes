import express from 'express';
const app = express();
import { json, urlencoded } from 'body-parser';
import path from 'path';
import { userRouter } from './routes/user';
import { notesRouter } from './routes/notes';
// Configuring env vars for local development
require('dotenv').config();

// BodyParser Middleware
app.use(urlencoded({ extended: false, limit: '10mb' }));
app.use(json({ limit: '10mb' }));

// connecting static files in public folder
app.use(express.static(path.join(__dirname + '/')));

app.use('/user', userRouter);
app.use('/note', notesRouter);

export { app };