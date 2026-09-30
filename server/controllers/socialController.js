const db = require('../config/db');
exports.likes = async (req, res, next) => {
  try {
    const [[row]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE post_id=?', [req.params.id]);
    res.json({ count: row.count });
  } catch (err) { next(err); }
};
exports.like = async (req, res, next) => {
  try {
    const [p] = await db.execute('SELECT id FROM posts WHERE id=?', [req.params.id]); if (!p.length) return res.status(404).json({ message: 'Post not found.' });
    await db.execute('INSERT IGNORE INTO likes(post_id,user_id) VALUES(?,?)', [req.params.id, req.user.id]);
    const [[count]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE post_id=?', [req.params.id]); res.json({ liked: true, count: count.count });
  } catch (err) { next(err); }
};
exports.unlike = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM likes WHERE post_id=? AND user_id=?', [req.params.id, req.user.id]);
    const [[count]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE post_id=?', [req.params.id]); res.json({ liked: false, count: count.count });
  } catch (err) { next(err); }
};
exports.comments = async (req, res, next) => {
  try { const [rows] = await db.execute('SELECT c.id,c.comment_text,c.created_at,u.name AS author FROM comments c JOIN users u ON u.id=c.user_id WHERE c.post_id=? ORDER BY c.created_at DESC', [req.params.id]); res.json({ comments: rows }); } catch (err) { next(err); }
};
exports.addComment = async (req, res, next) => {
  try {
    const text = String(req.body.comment_text || '').trim(); if (!text || text.length > 2000) return res.status(400).json({ message: 'Comment must be between 1 and 2000 characters.' });
    const [posts] = await db.execute('SELECT id FROM posts WHERE id=?', [req.params.id]); if (!posts.length) return res.status(404).json({ message: 'Post not found.' });
    const [result] = await db.execute('INSERT INTO comments(post_id,user_id,comment_text) VALUES(?,?,?)', [req.params.id,req.user.id,text]);
    const [rows] = await db.execute('SELECT c.id,c.comment_text,c.created_at,u.name AS author FROM comments c JOIN users u ON u.id=c.user_id WHERE c.id=?', [result.insertId]); res.status(201).json({ comment: rows[0] });
  } catch (err) { next(err); }
};
exports.deleteComment = async (req, res, next) => {
  try { const [rows] = await db.execute('SELECT user_id FROM comments WHERE id=?', [req.params.id]); if (!rows.length) return res.status(404).json({ message: 'Comment not found.' }); if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'You can only delete your own comments.' }); await db.execute('DELETE FROM comments WHERE id=?', [req.params.id]); res.json({ message: 'Comment deleted.' }); } catch (err) { next(err); }
};
