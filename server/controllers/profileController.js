export async function getProfile(req, res) {
  try {
    const user = req.user;
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      priorities: user.priorities,
      weeklyBudget: user.weeklyBudget,
      pointsLeft: user.pointsLeft,
      pointsUsed: user.pointsUsed,
      eventsAttended: user.eventsAttended.slice(-10)
    });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
