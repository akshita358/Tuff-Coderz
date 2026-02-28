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
});
