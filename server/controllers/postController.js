const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const fields = (b) => ({ title: String(b.title || '').trim(), location: String(b.location || '').trim(), description: String(b.description || '').trim() });
const valid = p => p.title && p.title.length <= 180 && p.location && p.location.length <= 180 && p.description && p.description.length <= 10000;

exports.list = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`SELECT p.id,p.user_id,p.title,p.location,p.description,p.image,p.created_at,u.name AS author,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.id) AS comment_count,
      EXISTS(SELECT 1 FROM likes ml WHERE ml.post_id=p.id AND ml.user_id=?) AS liked
      FROM posts p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC`, [req.user?.id || 0]);
    res.json({ posts: rows });
  } catch (err) { next(err); }
};
exports.get = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`SELECT p.id,p.user_id,p.title,p.location,p.description,p.image,p.created_at,u.name AS author,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.id) AS comment_count,
      EXISTS(SELECT 1 FROM likes ml WHERE ml.post_id=p.id AND ml.user_id=?) AS liked
      FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=?`, [req.user?.id || 0, req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found.' });
    res.json({ post: rows[0] });
  } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try {
    const p = fields(req.body);
    if (!valid(p) || !req.file) return res.status(400).json({ message: 'Add a title, location, description, and travel image.' });
    const [result] = await db.execute('INSERT INTO posts(user_id,title,location,description,image) VALUES(?,?,?,?,?)', [req.user.id, p.title, p.location, p.description, `/uploads/${req.file.filename}`]);
    res.status(201).json({ id: result.insertId, message: 'Your travel story is published.' });
  } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM posts WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found.' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'You are not allowed to edit this post.' });
    const p = fields(req.body); if (!valid(p)) return res.status(400).json({ message: 'Title, location, and description are required.' });
    const image = req.file ? `/uploads/${req.file.filename}` : rows[0].image;
    await db.execute('UPDATE posts SET title=?,location=?,description=?,image=? WHERE id=?', [p.title,p.location,p.description,image,req.params.id]);
    if (req.file && rows[0].image.startsWith('/uploads/')) fs.promises.unlink(path.join(__dirname,'..',rows[0].image)).catch(()=>{});
    res.json({ message: 'Post updated.' });
  } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT user_id,image FROM posts WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found.' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'You are not allowed to delete this post.' });
    await db.execute('DELETE FROM posts WHERE id=?', [req.params.id]);
    if (rows[0].image.startsWith('/uploads/')) fs.promises.unlink(path.join(__dirname,'..',rows[0].image)).catch(()=>{});
    res.json({ message: 'Post deleted.' });
  } catch (err) { next(err); }
};
