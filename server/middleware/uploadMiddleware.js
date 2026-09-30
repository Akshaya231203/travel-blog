const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_req, file, done) => done(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, done) => done(allowed.has(file.mimetype) ? null : new Error('Upload a JPG, PNG, WEBP, or GIF image.'), allowed.has(file.mimetype))
});
module.exports = upload;
