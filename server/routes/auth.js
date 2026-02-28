const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'attention_seekers_secret_key';

const checkWeeklyPoints = async (user) => {
    const now = new Date();
    const lastAllotment = user.lastPointsAllotment ? new Date(user.lastPointsAllotment) : null;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;

    if (!lastAllotment || (now - lastAllotment >= msPerWeek)) {
        user.currentPoints = (user.currentPoints || 0) + 100;
        user.lastPointsAllotment = now;
        user.needsWeeklyReset = true; // Trigger priority/event re-edit
        await user.save();
        return true;
    }
    return false;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await db.User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await db.User.create({ name, email, password: hashed });

        // Create default settings for the user
        await db.Setting.create({ userId: user.id });



        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { name: user.name, avatar: user.avatar } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        await checkWeeklyPoints(user);
        jwt.sign(payload, JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { name: user.name, avatar: user.avatar, needsWeeklyReset: user.needsWeeklyReset } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await db.User.findByPk(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Current Password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ msg: 'Password successfully updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// POST /api/auth/google
router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const googleData = ticket.getPayload();
        const { email, name, picture } = googleData;

        // Find or create user
        let user = await db.User.findOne({ where: { email } });
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            const salt = await bcrypt.genSalt(10);
            const randomPass = await bcrypt.hash(Math.random().toString(36), salt);
            user = await db.User.create({
                name: name || email.split('@')[0],
                email,
                password: randomPass,
                avatar: name ? name.charAt(0).toUpperCase() : 'G'
            });
            await db.Setting.create({ userId: user.id });

        }

        const payload = { user: { id: user.id } };
        if (!isNewUser) await checkWeeklyPoints(user);
        jwt.sign(payload, JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { name: user.name, avatar: user.avatar, needsWeeklyReset: user.needsWeeklyReset }, isNewUser });
        });
    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(500).json({ msg: 'Google authentication failed' });
    }
});

module.exports = router;
