# SMP International School Management System

**Software Development Project — CSE (Academic Project)**

A full-stack school management web application developed as a semester project. The system combines a responsive school website with separate Student, Teacher and Admin portals backed by a Node.js/Express server and SQLite database.

> **Project note:** Replace the student/teacher information below with your own details before submitting.

## Student Information

- **Student Name:** Fedain Rahman Moumi
- **Student ID:** 2023200000343
- **Department:** CSE
- **Course:** Software Development & Project Mangment Lab
- **Semester:** 9th
- **Institution:** Southeast University

## Main Features

### Public website
- Home page
- School information
- Principal message
- Campus/gallery section
- Admission information
- Class routine preview
- Notice board
- Testimonials
- Contact section

### Authentication
- Student / Teacher / Admin role selection
- Server-side login validation
- Password hashing with Node.js `scrypt`
- HttpOnly session cookie
- 8-hour session expiry
- Protected dashboard pages
- Role-based API authorization
- Secure logout
- Student/teacher registration

### Student portal
- Profile
- Routine
- Attendance
- Results
- Assignments
- Assignment submission
- Subjects
- Exam schedule
- Fees
- Library
- Calendar
- Notices

### Teacher portal
- Dashboard overview
- Student directory
- Attendance entry
- Result/marks entry
- Assignment publishing
- Submission count
- Routine
- Notices
- Reports/academic sections

### Admin portal
- Dashboard statistics
- Student directory
- Teacher directory
- Notice management
- Assignment overview

## Technology Used

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express.js
- SQLite3
- Fetch API
- Server-side session authentication

## Project Structure

```text
SMP-School-Management-System/
├── index.html
├── login.html
├── register.html
├── student-dashboard.html
├── teacher-dashboard.html
├── admin.html
├── style.css
├── portal.css
├── script.js
├── portal.js
├── server.js
├── package.json
├── .gitignore
├── .env.example
├── START-SMP-WEBSITE.bat
└── docs/
    ├── PROJECT-OVERVIEW.md
    ├── DATABASE-SCHEMA.md
    ├── API-REFERENCE.md
    └── GITHUB-SUBMISSION.md
```

## How to Run Locally

### 1. Install Node.js

Install the current Node.js LTS release. npm is included with Node.js.

### 2. Open the project in VS Code

Open this folder in Visual Studio Code.

### 3. Open VS Code Terminal

Use **Terminal → New Terminal**.

### 4. Install dependencies

```bash
npm install
```

This installs Express and SQLite3 and creates `package-lock.json`.

### 5. Start the server

```bash
npm start
```

### 6. Open the website

```text
http://localhost:3000
```

Do **not** open `login.html` or `register.html` by double-clicking them. They must be loaded through the Express server.

### Windows shortcut

After Node.js is installed, `START-SMP-WEBSITE.bat` can be double-clicked to install dependencies if needed and start the server.

## Demo Accounts

| Role | Login ID | Password |
|---|---|---|
| Student | SMP-0817 | 1234 |
| Student | SMP-0818 | 1234 |
| Teacher | T-104 | 1234 |
| Admin | ADMIN | admin123 |

These are development/demo accounts only.

## Suggested Demonstration for Viva

1. Open the public home page.
2. Login as Teacher (`T-104 / 1234`).
3. Publish a new assignment for Grade 8-B.
4. Logout.
5. Login as Student (`SMP-0817 / 1234`).
6. Open Assignments and show the new assignment loaded from SQLite.
7. Submit a short response.
8. Logout and login again as Teacher.
9. Show the updated submission count.
10. Login as Admin and show dashboard statistics and notice management.

This flow demonstrates that the system is not only a static UI: browser actions are sent to the backend and stored in the database.

## Database

The SQLite database file `school.db` is generated automatically when the server starts for the first time. It is intentionally excluded from Git because it is local runtime data. The application creates its tables and sample data automatically.

Main tables:

- `users`
- `sessions`
- `assignments`
- `submissions`
- `attendance`
- `results`
- `notices`
- `routine`
- `fees`
- `library`
- `exams`
- `calendar`

## Authentication Design

The login request is processed by the Express backend. A successful login creates a random server-side session token. The token is stored in the `sessions` table and returned to the browser as an HttpOnly cookie. Protected API routes verify that session before returning private data.

Students can only request their own student data. Teacher/admin endpoints are protected with role checks.

## Academic Project Scope

This repository is designed as a local academic project rather than a production school deployment. A production system would additionally require HTTPS, CSRF protection, rate limiting, password reset/email verification, stronger operational logging, database backups, deployment configuration and an external production database.

## Author / GitHub

Before submission, replace the placeholder student information at the top of this README and add your own GitHub repository URL.
