# Feedback Board

A simple fullstack feedback management system built as an entry task for the **Fullstack Builder Residency**.

🌐 **Live Demo:** https://feedback.saragh.ir

---

## Overview

Feedback Board is a small end-to-end product that allows users to submit feedback and allows an admin to review, track, and update the status of each feedback item.

The goal of this project was to build a clean and functional product with a simple architecture, clear API design, persistent data storage, authentication for admin-only actions, and a deployable setup.

---

## Features

### Public User

* Submit feedback using a simple public form
* Feedback includes:

  * Title
  * Message
* Newly submitted feedback is created with the default status: `submitted`

### Admin

* Admin login page
* Protected admin dashboard
* View all submitted feedbacks
* View summary statistics
* Update feedback status:

  * `submitted`
  * `in_review`
  * `resolved`
* Logout functionality

### Deployment

* Dockerized backend and frontend
* Docker Compose setup
* Deployed on a VPS
* Nginx reverse proxy
* HTTPS enabled with SSL
* Backend and frontend are only exposed locally behind Nginx

---

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Uvicorn

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### DevOps

* Docker
* Docker Compose
* Nginx
* SSL / HTTPS

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/sarahghazavi/Feedback-Board-Spring-1405.git
cd Feedback-Board-Spring-1405
```

---

## Run Locally Without Docker

### 2. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=sqlite:///./feedback_board.db
FRONTEND_ORIGIN=http://localhost:3000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=change-this-local-admin-token
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

## Run with Docker

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
FRONTEND_ORIGIN=http://localhost:3000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=change-this-local-admin-token
```

Run the project:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

---

## Admin Login

Default local admin credentials:

```text
username: admin
password: admin123
```

These values are configurable through environment variables.

For security reasons, production admin credentials are not included in this repository.

---

## API Endpoints

### Health Check

```http
GET /health
```

---

### Submit Feedback

```http
POST /feedback
```

Request body:

```json
{
  "title": "Login issue",
  "message": "I cannot log in to my account."
}
```

Response example:

```json
{
  "id": 1,
  "title": "Login issue",
  "message": "I cannot log in to my account.",
  "status": "submitted",
  "created_at": "2026-06-17T18:19:48.190038",
  "updated_at": "2026-06-17T18:19:48.190056"
}
```

---

### Admin Login

```http
POST /auth/login
```

Request body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response example:

```json
{
  "access_token": "admin-token",
  "token_type": "bearer"
}
```

---

### List Feedbacks

Protected endpoint:

```http
GET /feedback
```

Required header:

```http
Authorization: Bearer <admin-token>
```

---

### Update Feedback Status

Protected endpoint:

```http
PATCH /feedback/{feedback_id}/status
```

Request body:

```json
{
  "status": "in_review"
}
```

Valid statuses:

```text
submitted
in_review
resolved
```

---

## Assumptions

* Public users can only submit feedback.
* Only the admin can view feedbacks and update their statuses.
* Feedback deletion is not included because the task focuses on registration, tracking, and status management.
* SQLite is enough for local review and simple deployment.
* Admin credentials and tokens should be provided through environment variables.
* Production secrets are not committed to the repository.

---

## Possible Improvements

* Add pagination or filtering for feedbacks
* Add feedback deletion for admin users
* Add better token expiration and refresh logic
* Replace SQLite with PostgreSQL for production-scale usage
* Add automated tests
* Add CI/CD workflow for deployment

---

## Author

Built by **Sara Ghazavi** as an entry task for the **Fullstack Builder Residency**.
