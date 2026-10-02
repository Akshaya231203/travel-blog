require('dotenv').config();
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and set a secret.');
  process.exit(1);
}

const app = require('./app');
const db = require('./config/db');
const port = Number(process.env.PORT || 5000);

db.query('SELECT 1')
  .then(() => app.listen(port, '0.0.0.0', () => {
    console.log(`Travel blog running on port ${port}`);
  }))
  .catch((err) => {
    console.error('Could not connect to MySQL:', err.message);
    process.exit(1);
  });