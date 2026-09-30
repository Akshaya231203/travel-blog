const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function issueToken(res, user) {
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
}
exports.signup = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 72) return res.status(400).json({ message: 'Enter a name, valid email, and password of at least 8 characters.' });
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'An account with that email already exists.' });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name, email, hash]);
    const user = { id: result.insertId, name, email };
    issueToken(res, user);
    res.status(201).json({ user });
  } catch (err) { next(err); }
};
exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const [rows] = await db.execute('SELECT id,name,email,password,profile_image FROM users WHERE email = ?', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) return res.status(401).json({ message: 'Invalid email or password.' });
    const { password: _hash, ...user } = rows[0]; issueToken(res, user); res.json({ user });
  } catch (err) { next(err); }
};
exports.logout = (_req, res) => { res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }); res.json({ message: 'You are logged out.' }); };
exports.me = async (req, res, next) => { try { const [rows] = await db.execute('SELECT id,name,email,profile_image,created_at FROM users WHERE id=?', [req.user.id]); if (!rows.length) return res.status(401).json({ message: 'Please log in again.' }); res.json({ user: rows[0] }); } catch (err) { next(err); } };
