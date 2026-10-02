# Wanderly — Travel Blog

A responsive travel blogging application built with HTML, CSS, vanilla JavaScript, Node.js, Express, and MySQL. Users can register, share travel stories with images, explore posts, like and comment, and manage their own profile and posts.

## Features

- Secure account creation and login with bcrypt password hashing and HTTP-only JWT cookies
- Explore newest-first travel posts and view full stories
- Create, edit, and delete your own posts
- Like/unlike posts and add comments
- View and edit your profile
- Image uploads restricted to JPG, PNG, WEBP, and GIF (5 MB maximum)
- Responsive layout for mobile and desktop
- Parameterized MySQL queries, ownership checks, and cascading foreign keys

## Stack

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js, Express
- Database: MySQL (phpMyAdmin can be used to import/manage the schema)

## Project layout

```text
client/                 Static pages, styles, browser JavaScript
  pages/                Login, signup, explore, post, and profile pages
  css/style.css         Responsive visual design
  js/                   API, auth, posts, profile behavior
server/                 Express application
  config/db.js          MySQL connection pool
  controllers/          Auth, post, user, and social logic
  middleware/           Authentication, image uploads, errors
  routes/               REST API route definitions
  uploads/              User-uploaded images (not committed)
database/schema.sql     Database and tables
```

## Requirements

- Node.js 18 or newer and npm
- MySQL 8 (or compatible MySQL server)

## Database setup

1. Start MySQL through your local stack (for example, XAMPP).
2. Open phpMyAdmin and import `database/schema.sql`, or run that SQL file in your MySQL client.
3. The script creates `travel_blog_db` and its `users`, `posts`, `likes`, and `comments` tables. Register through the website to create a user; passwords are hashed by the application.
4. To load development stories, first sign up with `demo@wanderly.test`, then import `database/seed.sql` in phpMyAdmin. This keeps passwords hashed by the application rather than inserting plaintext credentials in SQL.

## Environment and run

From the project root:

```bash
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`. Edit `.env` and set your MySQL connection values and a long, random `JWT_SECRET`. Keep `.env` private and out of Git.

```bash
npm install
npm run dev
```

Open `http://localhost:5000`. The backend serves the frontend and API from the same origin. If the app reports a MySQL connection error, verify MySQL is running and the `.env` credentials match your setup.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current account |
| GET / POST | `/api/posts` | List / publish posts |
| GET / PUT / DELETE | `/api/posts/:id` | Read / edit / delete a post |
| POST / DELETE | `/api/posts/:id/like` | Like / unlike |
| GET / POST | `/api/posts/:id/comments` | Read / add comments |
| DELETE | `/api/comments/:id` | Delete your comment |
| GET / PUT | `/api/users/me` | Read / edit profile |
| GET | `/api/users/me/posts` | List your posts |

## Screenshots

Add screenshots of the home, explore, post details, and profile pages here after running the application.

## Future enhancements

- Search, filters, and pagination
- Email verification and password reset
- Search, filters, and pagination
- Automated test suite and CI workflow
- Email verification and password reset

## Free deployment (Render + TiDB Cloud + Cloudinary)

The app can be deployed on free tiers without entering a payment method, subject to each provider's current free limits. Free plans can change; keep billing disabled and never add a payment method if you want to avoid charges. Render free web services can sleep while idle, so the first visit after inactivity may take time. A Render local disk is temporary, so production images use Cloudinary.

1. Create a TiDB Cloud Starter cluster and create the database/tables by running `database/schema.sql` in its SQL editor. Copy its public connection host, port, username, and generated password.
2. Create a Cloudinary account and copy the cloud name, API key, and API secret from its dashboard.
3. In Render, create a Web Service from this GitHub repository. Use build command `npm install` and start command `npm start`. Choose the Free instance type.
4. Add these environment variables in Render: `NODE_ENV=production`, `JWT_SECRET` (a long random secret), `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=travel_blog_db`, `DB_SSL=true`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
5. Deploy and open the Render URL. Create an account and publish a test post with an image.

Never commit `.env` or enter paid options. The app will only deploy once you have created the provider accounts and supplied their connection values to Render.