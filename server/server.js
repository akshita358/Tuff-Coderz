<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';

dotenv.config();
const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/events', eventsRoutes);

const port = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(port, () => {});
=======
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'Attention Seekers API (SQLite) is running.' });
});

// Sync Database and start server
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
>>>>>>> feat/nimmi
});
