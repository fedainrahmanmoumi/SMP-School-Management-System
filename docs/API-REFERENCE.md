# API Reference

All API routes are served from the same Express server under `/api`.

## Public

- `GET /api/health` — checks whether the server is running.
- `POST /api/login` — authenticates a user and creates a session.
- `POST /api/register` — creates a student/teacher account and signs the user in.
- `POST /api/logout` — destroys the current session.

## Authenticated

- `GET /api/me` — current logged-in user.
- `GET /api/notices` — school notices.
- `GET /api/calendar` — academic calendar.

## Student

- `GET /api/student/:id/assignments`
- `POST /api/assignments/:id/submit`
- `GET /api/student/:id/results`
- `GET /api/student/:id/attendance`
- `GET /api/routine/:id`
- `GET /api/fees/:id`
- `GET /api/library/:id`
- `GET /api/exams/:id`

Student routes verify that the requested student ID belongs to the logged-in session.

## Teacher/Admin

- `GET /api/students`
- `GET /api/teachers` (admin)
- `POST /api/teacher/assignments`
- `GET /api/teacher/assignments`
- `POST /api/teacher/results`
- `POST /api/teacher/attendance`
- `POST /api/notices`
- `DELETE /api/notices/:id` (admin)
- `GET /api/stats` (admin)
