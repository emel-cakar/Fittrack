# FitTrack — Workout Logger

FitTrack is a web application that lets users log and track their personal workouts.
Built as part of a university Dynamic Web Applications module using Node.js, Express, EJS and MySQL.

---

## Features

- Register and log in with a personal account
- Dashboard showing total workouts, total minutes trained and recent activity
- Add, edit, delete and search your workout entries
- Each user can only see their own data

---

## Project Structure

```
fittrack/
├── app.js                  - main Express application
├── config/db.js            - MySQL database connection
├── controllers/            - logic for auth, workouts and dashboard
├── middleware/auth.js      - protects routes that require login
├── routes/                 - URL route definitions
├── views/                  - EJS page templates
├── public/css/style.css    - stylesheet
└── sql/                    - database setup scripts
```

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/emel-cakar/Fittrack.git
cd fittrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Open MySQL Workbench and run these two files in order:

1. `sql/create_db.sql` — creates the fittrack database and tables
2. `sql/insert_test_data.sql` — inserts sample users and workouts for testing

### 4. Set up the environment file

Copy the example file and fill in your own MySQL password:

```bash
cp .env.example .env
```

Open `.env` and change:

```
DB_PASSWORD=your_mysql_root_password
```

### 5. Start the server

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## Test Accounts

| Username | Password |
|---|---|
| john_doe | password123 |
| jane_fit | password123 |

---

## Built With

- Node.js & Express
- EJS
- MySQL / mysql2
- bcrypt
- express-session
- dotenv
