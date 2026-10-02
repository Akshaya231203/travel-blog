const fs = require('fs/promises');
const crypto = require('crypto');

async function storeImage(file) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName && !apiKey && !apiSecret) return `/uploads/${file.filename}`;
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloud image storage is not fully configured.');

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex');
  const form = new FormData();
  const buffer = await fs.readFile(file.path);
  form.append('file', new Blob([buffer], { type: file.mimetype }), file.originalname);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, { method: 'POST', body: form });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) throw new Error('Image upload failed. Please try again.');
  await fs.unlink(file.path).catch(() => {});
  return result.secure_url;
}

module.exports = { storeImage };
