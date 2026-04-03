# MediBuddy

MediBuddy is a full-stack medication management application with separate user and admin areas. It allows users to manage medications, reminders, and dose logs, while admins can manage users and system content.

## Features

### User features
- Register and log in
- View a user dashboard
- Add, edit, and delete medications
- Create and manage reminders
- Log medication doses

### Admin features
- Log in to the admin dashboard
- View registered users
- Delete users
- Access medication catalogue and notification template pages

## Example login accounts

### Test user
- **Email:** `testuser@mail.com`
- **Password:** `password`

### Test admin
- **Email:** `testadmin@mail.com`
- **Password:** `password`

## How to use the app

### 1. Open the application
Go to the deployed application URL in your browser.

### 2. Log in
Use one of the example accounts above, or register a new user account from the login page.

### 3. User workflow
After logging in as a standard user, you can:
- Open **Dashboard** to view the main user area
- Open **Medications** to add, edit, or delete medications
- Open **Reminders** to create and manage reminder schedules
- Open **Dose Log** to record medication intake history

### 4. Admin workflow
After logging in as an admin, you can:
- Open **Admin Dashboard**
- Open **Users** to view and delete user accounts
- Open **Catalogue** and **Templates** for admin-side content management pages

## Local setup

### Backend
1. Open a terminal in the `backend` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5001
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend
1. Open a terminal in the `frontend` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

## Deployment notes
- The frontend is served through Nginx
- The backend runs on port `5001`
- API requests are routed through `/api`

## Project structure
- `frontend/` - React frontend
- `backend/` - Node.js / Express backend
- `backend/test/` - backend test files

## Notes
- If changes do not appear immediately, rebuild the frontend and refresh the browser
- Make sure the backend is running before trying to log in or load data
