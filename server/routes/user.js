const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models');

// GET /api/user/dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const events = await db.Event.findAll({ where: { userId: req.user.id } });
        const attended = events.filter(e => e.status === 'Attended');
        const upcoming = events.filter(e => e.status !== 'Attended');

        res.json({
            profile: { name: user.name, avatar: user.avatar, email: user.email },
            points: { current: user.currentPoints, spent: user.spentPoints, dailyWellness: user.dailyWellness },
            events: { attended, upcoming }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/user/settings
router.get('/settings', auth, async (req, res) => {
    try {
        const setting = await db.Setting.findOne({
            where: { userId: req.user.id },
            include: [
                { model: db.Priority, as: 'priorities' },
                { model: db.User, attributes: ['name', 'email', 'avatar'] }
            ],
            order: [[{ model: db.Priority, as: 'priorities' }, 'rank', 'ASC']]
        });
        if (!setting) return res.status(404).json({ msg: 'Settings not found' });

        res.json({
            toggles: {
                autoAdjust: setting.autoAdjust,
                emailReminders: setting.emailReminders,
                eventAlerts: setting.eventAlerts,
                weeklySummary: setting.weeklySummary,
                twoFactor: setting.twoFactor
            },
            priorities: setting.priorities || [],
            profile: {
                name: setting.User.name,
                email: setting.User.email,
                avatar: setting.User.avatar
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/user/settings
router.put('/settings', auth, async (req, res) => {
    const { priorities, toggles, name } = req.body;
    try {
        let setting = await db.Setting.findOne({ where: { userId: req.user.id } });
        if (!setting) {
            setting = await db.Setting.create({ userId: req.user.id });
        }

        // Update User name
        if (name) {
            const user = await db.User.findByPk(req.user.id);
            if (user) {
                user.name = name;
                user.avatar = name.charAt(0).toUpperCase();
                await user.save();
            }
        }

        // Update toggles
        if (toggles) {
            await setting.update({
                autoAdjust: toggles.autoAdjust,
                emailReminders: toggles.emailReminders,
                eventAlerts: toggles.eventAlerts,
                weeklySummary: toggles.weeklySummary,
                twoFactor: toggles.twoFactor
            });
        }

        // Update priorities
        if (priorities) {
            await db.Priority.destroy({ where: { settingId: setting.id } });
            for (const p of priorities) {
                await db.Priority.create({ settingId: setting.id, name: p.name, rank: p.rank });
            }
        }

        // Fetch updated settings
        const updated = await db.Setting.findOne({
            where: { userId: req.user.id },
            include: [
                { model: db.Priority, as: 'priorities' },
                { model: db.User, attributes: ['name', 'email', 'avatar'] }
            ],
            order: [[{ model: db.Priority, as: 'priorities' }, 'rank', 'ASC']]
        });

        res.json({
            toggles: {
                autoAdjust: updated.autoAdjust,
                emailReminders: updated.emailReminders,
                eventAlerts: updated.eventAlerts,
                weeklySummary: updated.weeklySummary,
                twoFactor: updated.twoFactor
            },
            priorities: updated.priorities,
            profile: {
                name: updated.User.name,
                email: updated.User.email,
                avatar: updated.User.avatar
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/user/events/bulk
router.post('/events/bulk', auth, async (req, res) => {
    const { events } = req.body;
    try {
        const user = await db.User.findByPk(req.user.id);
        const setting = await db.Setting.findOne({
            where: { userId: req.user.id },
            include: [{ model: db.Priority, as: 'priorities' }]
        });

        if (!user || !setting) return res.status(404).json({ msg: 'User or Settings not found' });

        // Map priorities for easy lookup
        const priorityMap = {};
        setting.priorities.forEach(p => {
            priorityMap[p.name.toLowerCase()] = p.rank;
        });

        let totalCost = 0;
        const formatted = events.map(e => {
            const cat = e.category.toLowerCase();
            const rank = priorityMap[cat];
            let cost = 10; // Default

            if (rank === 1) cost = 5;
            else if (rank === 2) cost = 10;
            else if (rank === 3) cost = 20;

            totalCost += cost;
            return {
                ...e,
                userId: req.user.id
            };
        });

        if (user.currentPoints < totalCost) {
            return res.status(400).json({ msg: `Insufficient points. Total cost: ${totalCost}, Current balance: ${user.currentPoints}` });
        }

        // Deduct points and clear reset flag
        user.currentPoints -= totalCost;
        user.spentPoints += totalCost;
        user.needsWeeklyReset = false;
        await user.save();

        await db.Event.bulkCreate(formatted);
        res.json({ msg: 'Events saved and points deducted successfully', totalCost, remainingPoints: user.currentPoints });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
