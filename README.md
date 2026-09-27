# 🏋️ GymFit 2.0

### Full-Stack Gym Management & Fitness Platform

GymFit 2.0 is a modern full-stack fitness management platform designed to connect gym members, workouts, nutrition tracking, memberships, and administrative operations in one system.

The project combines a responsive React frontend, REST API backend, PostgreSQL database, JWT authentication, and cloud deployment using Cloudflare and Supabase.

---

## 🚀 Live Application

**Frontend:**
https://gymfit-2-0.pages.dev

**Backend API:**
https://gymfit-2-0.shahzaibahmad1106.workers.dev

---

## ✨ Features

### 👤 Authentication

* User registration
* Secure login
* JWT-based authentication
* Protected routes
* Role-based access control
* Member and administrator accounts
* Active/inactive account handling

### 🏋️ Member Dashboard

* Personalized member dashboard
* Profile management
* Password management
* Workout browsing
* Workout details
* Workout session tracking
* Workout completion tracking
* Activity statistics

### 🥗 Nutrition

* Nutrition logging
* Meal tracking
* Calories
* Protein
* Carbohydrates
* Fats
* Nutrition history
* Meal deletion

### 💳 Membership

* Membership plans
* Plan pricing
* Plan features
* Current membership information
* Membership subscription
* Payment history
* Membership status tracking

### 🛠️ Admin Dashboard

* Administrative dashboard
* Member management
* Member status management
* Workout management
* Workout creation
* Workout updates
* Workout deletion
* Workout logs
* Platform statistics
* Admin-only protected routes

---

## 🧰 Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT
* bcryptjs

### Database

* PostgreSQL
* Supabase

### Cloud Infrastructure

* Cloudflare Pages
* Cloudflare Workers
* Cloudflare Hyperdrive

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│       Cloudflare Pages       │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       Express Backend        │
│      Cloudflare Workers      │
└──────────────┬───────────────┘
               │
               │ Hyperdrive
               ▼
┌──────────────────────────────┐
│     PostgreSQL Database      │
│           Supabase           │
└──────────────────────────────┘
```

---

## 📂 Project Structure

```text
GymFit-2.0/
│
├── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   │   ├── Admin/
│   │   └── Member/
│   ├── services/
│   ├── App.jsx
│   └── index.css
│
├── worker/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── db.js
│   └── index.js
│
├── wrangler.jsonc
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔐 Security

GymFit 2.0 uses:

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Admin-only endpoints
* Environment-based configuration
* Cloudflare Worker secrets
* Database credentials kept outside source control

Sensitive credentials and database backups are excluded from Git tracking.

---

## 🗄️ Database

The platform uses PostgreSQL with dedicated tables for:

* Users
* Members
* Workouts
* Exercises
* Workout exercises
* Workout logs
* Nutrition logs
* Membership plans
* Member memberships
* Membership payments

The database is hosted using **Supabase PostgreSQL** in production.

---

## 🌐 Deployment

### Frontend

Deployed using:

**Cloudflare Pages**

### Backend

Deployed using:

**Cloudflare Workers**

### Database Connectivity

Production Worker database access uses:

**Cloudflare Hyperdrive → Supabase PostgreSQL**

---

## ⚙️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Shahzaib1106/GymFit-2.0.git
cd GymFit-2.0
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Start the backend locally

```bash
cd server
npm install
npm run dev
```

Configure the required environment variables before running the backend locally.

---

## 📌 API Modules

```text
/api/auth
/api/member
/api/workouts
/api/admin
/api/nutrition
/api/membership
```

---

## 📊 Current Project Status

| Module                    | Status     |
| ------------------------- | ---------- |
| React Frontend            | ✅ Complete |
| Authentication            | ✅ Complete |
| Member Dashboard          | ✅ Complete |
| Workout System            | ✅ Complete |
| Nutrition System          | ✅ Complete |
| Membership System         | ✅ Complete |
| Admin System              | ✅ Complete |
| PostgreSQL Database       | ✅ Complete |
| Supabase Integration      | ✅ Complete |
| Cloudflare Workers        | ✅ Deployed |
| Cloudflare Pages          | ✅ Deployed |
| Production Authentication | ✅ Tested   |
| Protected APIs            | ✅ Tested   |

---

## 🎯 Project Goals

GymFit 2.0 was developed to provide a complete digital gym management experience rather than a simple fitness website.

The platform focuses on:

* Centralized gym management
* Member self-service
* Workout tracking
* Nutrition monitoring
* Membership management
* Administrative control
* Secure authentication
* Cloud-based deployment
* Scalable full-stack architecture

---

## 👨‍💻 Developer

**Shahzaib Ahmad**

BSCS Candidate
Lahore Garrison University

GitHub:
https://github.com/Shahzaib1106

LinkedIn:
https://www.linkedin.com/in/shahzaib-ahmad1105/

---

## 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
