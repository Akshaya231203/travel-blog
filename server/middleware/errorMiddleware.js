function notFound(_req, res) { res.status(404).json({ message: 'That page or resource was not found.' }); }
function errorHandler(err, _req, res, _next) {
  console.error(err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Image must be 5 MB or smaller.' });
  if (err.message.startsWith('Upload a JPG')) return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong. Please try again.' });
}
module.exports = { notFound, errorHandler };
