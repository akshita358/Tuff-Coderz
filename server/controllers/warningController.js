// Minimal, independent controller that reads weeklyBudget from User model (Mongo/Mongoose expected)
// Returns an array of warning messages based on thresholds.
module.exports = {
  async getWarning(req, res) {
    try {
      const User = require('../models/User');
      const userId = req.params.userId || (req.user && req.user.id);
      if (!userId) {
        return res.status(400).json({ warnings: [], error: 'userId required' });
      }
      // Attempt to support Mongoose-style models
      let userDoc = null;
      if (typeof User.findById === 'function') {
        userDoc = await User.findById(userId).select('weeklyBudget').lean();
      } else {
        // If not a Mongoose model, return empty without touching other logic
        return res.json({ warnings: [] });
      }
      const wb = userDoc && typeof userDoc.weeklyBudget === 'number' ? userDoc.weeklyBudget : undefined;
      const warnings = [];
      if (typeof wb === 'number') {
        if (wb <= 25) warnings.push('Critical budget warning');
        else if (wb <= 50) warnings.push('Half budget warning');
      }
      return res.json({ warnings });
    } catch (err) {
      return res.status(500).json({ warnings: [], error: 'warning check failed' });
    }
  },
};
