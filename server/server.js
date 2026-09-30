require('dotenv').config();
if(!process.env.JWT_SECRET){console.error('JWT_SECRET is missing. Copy .env.example to .env and set a secret.');process.exit(1);}
const app=require('./app'); const db=require('./config/db'); const port=process.env.PORT||5000;
db.query('SELECT 1').then(()=>app.listen(port,()=>console.log(`Travel blog running at http://localhost:${port}`))).catch(err=>{console.error('Could not connect to MySQL:',err.message);process.exit(1);});
