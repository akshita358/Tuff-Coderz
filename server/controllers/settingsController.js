export async function updateSettings(req, res) {
  try {
    const user = req.user;
    const { priorities, weeklyBudget } = req.body;
    if (Array.isArray(priorities) && priorities.length === 3) {
      user.priorities = priorities;
    }
    if (typeof weeklyBudget === 'number' && weeklyBudget >= 10) {
      user.weeklyBudget = weeklyBudget;
      user.pointsLeft = Math.min(user.pointsLeft, weeklyBudget);
      user.pointsUsed = Math.max(0, weeklyBudget - user.pointsLeft);
    }
    await user.save();
    return res.json({
      priorities: user.priorities,
      weeklyBudget: user.weeklyBudget,
      pointsLeft: user.pointsLeft,
      pointsUsed: user.pointsUsed
    });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
