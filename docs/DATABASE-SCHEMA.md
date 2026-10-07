# Database Schema

The application creates the following SQLite tables automatically.

| Table | Purpose |
|---|---|
| `users` | Student, teacher and admin accounts |
| `sessions` | Active server-side login sessions |
| `assignments` | Teacher-created assignments |
| `submissions` | Student assignment submissions |
| `attendance` | Student attendance records |
| `results` | Student marks/results |
| `notices` | School announcements |
| `routine` | Class timetable |
| `fees` | Student fee records |
| `library` | Issued library books |
| `exams` | Examination schedule |
| `calendar` | Academic events |

The local `school.db` file is generated at runtime and is excluded from Git with `.gitignore`.
