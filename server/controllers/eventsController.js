import Event from '../models/Event.js';

function rankBonus(rank) {
  if (rank === 0) return 10;
  if (rank === 1) return 5;
  return 0;
}

function rankMultiplier(rank) {
  if (rank === 0) return 0.5;
  if (rank === 1) return 1;
  return 2;
}

export async function attend(req, res) {
  try {
    const { name, category } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'Missing fields' });
    const user = req.user;
    const base = 10;
    const rank = user.priorities.indexOf(category);
    if (rank === -1) return res.status(400).json({ error: 'Unknown category' });
    const cost = Math.round(base * rankMultiplier(rank));
    if (user.pointsLeft < cost) return res.status(400).json({ error: 'Insufficient points', required: cost, pointsLeft: user.pointsLeft });
    user.pointsLeft = Math.max(0, user.pointsLeft - cost);
    user.pointsUsed = Math.max(0, user.weeklyBudget - user.pointsLeft);
    const bonus = rankBonus(rank);
    user.pointsLeft = Math.min(user.weeklyBudget, user.pointsLeft + bonus);
    user.pointsUsed = Math.max(0, user.weeklyBudget - user.pointsLeft);
    const evt = await Event.create({ userId: user._id, name, category, cost, bonus });
    user.eventsAttended.push({ name, category, cost, bonus });
    await user.save();
    return res.json({
      event: { id: evt._id, name, category, cost, bonus },
      summary: { weeklyBudget: user.weeklyBudget, pointsLeft: user.pointsLeft, pointsUsed: user.pointsUsed }
    });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
