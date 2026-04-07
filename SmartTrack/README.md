# SmartTrack - Job Application Tracking Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-9.1.1-green)

A full-stack MERN application for tracking job applications, managing placement journeys, and analyzing application statistics.

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)


---

## <a id="overview"></a>🎯 Overview

**SmartTrack** is a comprehensive job application tracking platform designed to help students and job seekers manage their placement journey efficiently. The platform provides a centralized dashboard to track applications, monitor progress, add notes, and analyze statistics.

### Key Highlights

- ✅ **Full-stack MERN application** with modern UI/UX
- ✅ **Secure authentication** with JWT (Access + Refresh Tokens) & Extensible RBAC Architecture
- ✅ **Real-time analytics** with interactive charts
- ✅ **Advanced Search** with pagination, filtering, and text indexing
- ✅ **Dark mode** theme with responsive design

- ✅ **Email Notifications** for welcome messages (Mailtrap)
- ✅ **CRUD operations** for complete application management

---

## <a id="features"></a>✨ Features

### 🔐 Authentication & Security

- **Stateless Authentication**: Short-lived Access Tokens (15m) and Long-lived Refresh Tokens (7d)
- **Secure Storage**: Refresh tokens stored in HTTP-Only, Secure, SameSite cookies
- **RBAC Architecture**: Scalable Role-Based Access Control logic (Student, Admin) ready for future expansion
- **Secure Logout**: Server-side token invalidation
- User registration and login
- Password hashing with bcrypt
- Change password functionality
- Protected routes

### 📧 Email Notifications

- **Welcome Emails**: Automated email logic integrated with **Mailtrap** for safe testing and development environment email delivery
- **Mailtrap Integration**: Secure sandbox environment to prevent spamming real email addresses during development


### 📊 Application Management

- **Add Applications**: Track company name, role, and application details
- **Update Applications**: Edit application information and status
- **Delete Applications**: Remove applications with confirmation
- **Status Tracking**: Monitor progress (Applied, In Progress, Offer, Rejected)
- **Quick Status Update**: One-click status changes
- **Notes**: Add and store notes for each application
- **OA Links**: Store online assessment links
- **Application Stages**: Track specific interview rounds (e.g., Technical, HR) with status and dates

### 🔍 Search & Filter

- **Full-Text Search**: Indexed search by company name and role
- **Pagination**: Efficient data loading with page & limit support
- **Filtering**: Filter by application status (applied, offer, rejected, etc.)
- **Sorting**: Sort by newest, oldest, or company name
- Real-time filtering and search results

### 📈 Analytics Dashboard

- Visual statistics with bar charts
- Application status counts
- Overview cards for quick insights

### 👤 Profile Management

- View and edit profile information
- Manage skills (add/remove)
- Change password securely
- Update email and name

### 🎨 User Interface

- Modern dark theme
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling

---

## <a id="tech-stack"></a>🛠 Tech Stack

### Frontend

- **React** 19.2.0 - UI library
- **React Router DOM** 7.11.0 - Routing
- **Tailwind CSS** 3.4.15 - Styling
- **Axios** 1.13.2 - HTTP client
- **Recharts** 3.6.0 - Data visualization
- **Shadcn UI** - Reusable UI components
- **Lucide React** 0.562.0 - Icons
- **Vite** 7.2.4 - Build tool

### Backend

- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** 9.1.1 - Database
- **Mongoose** 9.1.1 - ODM
- **JWT** 9.0.3 - Authentication
- **cookie-parser** - Cookie management
- **bcryptjs** 3.0.3 - Password hashing
- **Mailtrap** - Email testing and delivery
- **CORS** 2.8.5 - Cross-origin resource sharing
- **dotenv** 17.2.3 - Environment variables

---

## <a id="installation"></a>🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd MERN
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

---

## <a id="configuration"></a>⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smarttrack
JWT_SECRET=your_super_secret_jwt_key_here
```

**For MongoDB Atlas:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smarttrack?retryWrites=true&w=majority
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000/api` by default. If your backend runs on a different port, update `client/src/api/axios.js`:

```javascript
baseURL: "http://localhost:YOUR_PORT/api";
```

---

## <a id="usage"></a>💻 Usage

### Start the Development Server

1. **Start MongoDB** (if running locally):

   ```bash
   mongod
   ```

2. **Start Backend Server**:

   ```bash
   cd server
   npm run dev
   ```

   Server runs on `http://localhost:5000`

3. **Start Frontend Development Server**:

   ```bash
   cd client
   npm run dev
   ```

   Client runs on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

---
---

## <a id="screenshots"></a>📸 Screenshots

Here are some previews of the SmartTrack application:

### 🏠 Home Page
![Home Page](./screenshots/home.png)

### 🏠 Home Page(dark)
![Home Page](./screenshots/homedark.png)

### 📋 Dashboard
![Dashboard](./screenshots/dashboard.png)

### 📋 Dashboard(dark)
![Dashboard](./screenshots/dashboarddark.png)

### 👤 Application
![Profile](./screenshots/application.png)

### 👤 Application(dark)
![Profile](./screenshots/applicationdark.png)

### 👤 Profile Page
![Profile](./screenshots/profile.png)

### 👤 Profile Page(dark)
![Profile](./screenshots/profiledark.png)

> 📌 Add your screenshots inside a `/screenshots` folder in your project root and update filenames accordingly.
---
## <a id="api-documentation"></a>📡 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/users
Content-Type: application/json

{
  "name": "Devang Chauhan",
  "email": "devang@gmail.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "devang@gmail.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Refresh Access Token

```http
POST /api/users/refresh
Cookie: jwt=<refresh_token>
```

#### Logout

```http
POST /api/users/logout
Cookie: jwt=<refresh_token>
```

#### Update Profile

```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Devang Chauhan",
  "email": "devang@gmail.com",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### Change Password

```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Application Endpoints

#### Get Applications (with Pagination & Search)

```http
GET /api/applications?page=1&limit=10&search=Google&status=applied&sortBy=newest
Authorization: Bearer <token>
```

#### Create Application

```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Google",
  "role": "Software Engineer",
  "oaLink": "https://example.com/oa",
  "notes": "Applied through referral"
}
```

#### Update Application

```http
PUT /api/applications/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Google",
  "role": "Senior Software Engineer",
  "status": "in-progress",
  "notes": "Interview scheduled"
}
```

#### Delete Application

```http
DELETE /api/applications/:id
Authorization: Bearer <token>
```

#### Add Application Stage

```http
PUT /api/applications/:id/stage
Authorization: Bearer <token>
Content-Type: application/json

{
  "stageName": "Technical Round 1",
  "status": "cleared",
  "date": "2024-01-15"
}
```

---

## <a id="project-structure"></a>📁 Project Structure

```
MERN/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   │   └── db.js          # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   ├── userController.js
│   │   └── applicationController.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── error.middleware.js
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   └── Application.js
│   ├── routes/            # API routes
│   │   ├── userRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/             # Utility functions
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

## 👨‍💻 Author

**Devang Chauhan**

- GitHub: [@devangchauhanq10](https://github.com/devangchauhanq10)
- LinkedIn: [Devang Chauhan](https://www.linkedin.com/in/devang-chauhan-8859703a6/)
- Email: dccule@gmail.com

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library

---

<div align="center">

⭐ Star this repo if you find it helpful. Thank you ~ Devang Chauhan

</div>
