# GitHub Submission Guide

## First-time setup

Open this project folder in VS Code.

### 1. Check Git

```bash
git --version
```

If Git is not installed, install Git for Windows from the official Git website.

### 2. Configure your Git identity once

Use your own name and GitHub email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3. Install and test the project

```bash
npm install
npm start
```

Open `http://localhost:3000` and test the demo login before committing.

Stop the server with `Ctrl + C` after testing.

## Create the Git repository

In the VS Code terminal, from the project root:

```bash
git init
git add .
git commit -m "Initial school management system"
```

## Create a GitHub repository

On GitHub, create a new empty repository, for example:

`SMP-International-School-Management-System`

Do not add another README if you already have the README in this project.

Then connect the local repository:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/SMP-International-School-Management-System.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Recommended development commits

For an authentic academic development history, make commits when you actually complete work. Do not invent fake dates or fake work.

Examples:

```bash
git add .
git commit -m "Create school website interface"

git add .
git commit -m "Add student and teacher dashboards"

git add .
git commit -m "Connect Express backend and SQLite"

git add .
git commit -m "Implement login and session authentication"

git add .
git commit -m "Connect assignments attendance and results"

git push
```

Only use commit messages that accurately describe changes you actually made.

## After the first push

Whenever you change the project:

```bash
git status
git add .
git commit -m "Describe what I changed"
git push
```

## What the teacher can inspect

Your GitHub repository will show:

- Source code
- HTML/CSS/JavaScript frontend
- Express backend
- SQLite schema creation code
- Authentication/session logic
- API routes
- Project documentation
- Git commit history
- `.gitignore`
- `package.json`

`node_modules` and your local `school.db` should not be pushed.

## Important

Never commit real passwords, private API keys, `.env` files, or personal secrets. The demo credentials in this academic project are sample credentials only.
