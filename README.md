# Homeland Football Academy Backend API

A secure, RESTful API built with Node.js, Express, and MySQL for managing academy applications, video content, and dashboard statistics.

## Features

- **Admin Authentication**: JWT-based auth with access and refresh tokens.
- **Application Management**: Public submission, admin review, status updates, and CSV/XLSX export.
- **Video Management**: Secure CRUD operations for gallery content.
- **Dashboard Analytics**: Real-time stats, program distribution, and monthly trends.
- **Lead Capture**: Contact form with automated email notifications.
- **Email System**: Integration with Nodemailer for admin alerts and parent updates.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: MySQL + Sequelize
- **Auth**: JWT + Bcryptjs
- **Validation**: Joi
- **Export**: ExcelJS + CSV-Stringify
- **Email**: Nodemailer (SMTP)
- **Testing**: Jest + Supertest

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory (refer to the documentation).

3. **Database Setup & Migrations**:
   The backend includes an automated script to create the database, tables, and the initial admin user.
   
   See the [Database Setup Guide](#database-setup-guide) for details.
   ```bash
   node scripts/setup-db.js
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

6. **Deploy with Docker**:
   ```bash
   docker compose up --build -d
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Admin login
- `POST /api/auth/refresh`: Refresh access token
- `POST /api/auth/logout`: Logout (protected)
- `GET /api/auth/session`: Current session info (protected)

### Applications
- `POST /api/applications/public`: Submit new application
- `GET /api/applications/protected`: List applications (protected, supports filtering/pagination)
- `GET /api/applications/export`: Export as CSV/XLSX (protected)
- `GET /api/applications/:id`: View single application (protected)
- `PATCH /api/applications/:id/status`: Update status (protected)

### Videos
- `GET /api/videos`: List all videos (protected)
- `POST /api/videos`: Add new video (protected)
- `PATCH /api/videos/:id`: Update video (protected)
- `DELETE /api/videos/:id`: Delete video (protected)

### Statistics
- `GET /api/stats/overview`: Totals for dashboard
- `GET /api/stats/applications-by-program`: Program distribution
- `GET /api/stats/monthly-trend`: Monthly application count
- `GET /api/stats/age-distribution`: Age buckets

### Contact
- `POST /api/contact/send-contact-email`: Submit contact form

---

## Database Setup Guide

To initialize your backend with a new MySQL/MariaDB database:

### 1. Configure Environment
Update your `.env` file with your `DATABASE_URL`. If the database doesn't exist yet, point it to the server's root or a system table (like `mysql`) so the script can connect and create the `homelandfc` database.

Example:
`DATABASE_URL=mysql://user:pass@host:port/mysql`

### 2. Run Setup Script
Execute the following command:
```bash
node scripts/setup-db.js
```

**What this script does:**
1. **Creates Database**: Checks if `homelandfc` exists, and creates it if not.
2. **Migrates Tables**: Automatically creates/updates the `Admins`, `Applications`, `Videos`, and `ContactMessages` tables.
3. **Seeds Admin**: Creates a default Super Admin user.

*Default Admin Credentials:*
- **Email**: `admin@homelandfc.com`
- **Password**: `adminpassword123`

### 3. Update Environment
After the script completes, ensure your `.env` points to the correctly created database:
`DATABASE_URL=mysql://user:pass@host:port/homelandfc`
