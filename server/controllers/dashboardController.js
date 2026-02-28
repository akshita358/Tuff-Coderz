import Event from '../models/Event.js';

export async function getDashboard(req, res) {
  try {
    const user = req.user;
    const recent = await Event.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).lean();
    const counts = { Academics: 0, Skills: 0, 'Co-Curricular': 0 };
    recent.forEach(e => { if (counts[e.category] !== undefined) counts[e.category] += e.cost; });
    return res.json({
      summary: {
        weeklyBudget: user.weeklyBudget,
        pointsLeft: user.pointsLeft,
        pointsUsed: user.pointsUsed
      },
      usageByCategory: counts,
      recentEvents: recent.map(e => ({ name: e.name, category: e.category, cost: e.cost, bonus: e.bonus }))
    });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
