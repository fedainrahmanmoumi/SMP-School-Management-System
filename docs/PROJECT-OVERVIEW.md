# Project Overview

## Problem Statement

Schools need a single system for communicating notices, sharing assignments, maintaining attendance and results, and giving students access to academic information. A collection of static web pages cannot provide this interaction reliably because changes need to be stored and retrieved from a database.

## Proposed Solution

The SMP International School Management System provides a public school website plus authenticated dashboards for students, teachers and administrators. The frontend communicates with an Express REST-style API, while SQLite stores users and academic records.

## System Flow

```text
Browser
   |
   | HTTP / Fetch API
   v
Express Server (Node.js)
   |
   +---- Authentication & Sessions
   |
   +---- Role Authorization
   |
   +---- School Management APIs
   |
   v
SQLite Database
```

## Roles

### Student
Can access only the logged-in student's private academic information and submit assignments.

### Teacher
Can manage assignments, attendance, marks and notices within the available project modules.

### Admin
Can view management information, students/teachers and manage notices.

## Key Learning Outcomes

This project demonstrates:

- Frontend page design
- Client-side JavaScript
- REST-style API communication
- Node.js server development
- SQLite database design
- Authentication and sessions
- Role-based authorization
- CRUD-style operations
- Git/GitHub project management
