import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

export { app };
