import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function sign(user) {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password, priorities } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      priorities: Array.isArray(priorities) && priorities.length === 3 ? priorities : ['Academics', 'Skills', 'Co-Curricular'],
      weeklyBudget: 100,
      pointsLeft: 100,
      pointsUsed: 0
    });
    const token = sign(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        priorities: user.priorities,
        weeklyBudget: user.weeklyBudget,
        pointsLeft: user.pointsLeft,
        pointsUsed: user.pointsUsed
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = sign(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        priorities: user.priorities,
        weeklyBudget: user.weeklyBudget,
        pointsLeft: user.pointsLeft,
        pointsUsed: user.pointsUsed
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
