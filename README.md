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
- Cloud image storage for production deployment
- Automated test suite and CI workflow
- Public hosting and a managed MySQL database
