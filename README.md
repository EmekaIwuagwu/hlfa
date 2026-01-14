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

3. **Seed Admin User**:
   ```bash
   node src/utils/seedAdmin.js
   ```
   *Default Credentials:*
   - Email: `admin@homelandfc.com`
   - Password: `adminpassword123`

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Run Tests**:
   ```bash
   npm test
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
