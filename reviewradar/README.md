# ReviewRadar - AI-Powered Customer Feedback Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)

---

## <a id="overview"></a>🎯 Overview
**ReviewRadar** is a full-stack customer feedback platform featuring seamless LLM integration to process unstructured review data. Leverages advanced AI capabilities to automatically transform customer text into actionable business intelligence. It provides a centralized dashboard to collect, manage, and analyze user feedback efficiently.

---

## <a id="features"></a>✨ Features

### 🧠 AI-Powered Insights
- **Gemini 2.5 Flash Integration**: Automatically process and analyze text reviews.
- **Sentiment Analysis**: Extract consumer sentiment (Positive, Neutral, Negative) instantly from feedback.
- **Actionable Metrics**: Generate smart insights to help business owners make data-backed decisions.

### � Authentication & Security
- **Clerk Integration**: Seamless and secure user authentication and management.
- **Protected Routes**: Middleware to protect sensitive dashboard and administration areas.
- **Secure Data Access**: Ensure users only see and manage their own feedback contexts.

### 📊 Feedback Management
- **Categorization**: Sort feedback automatically into categories like Bug, Feature, UX, Performance, and Other.
- **Rating System**: Quantitative metric tracking alongside qualitative text.
- **Status Tracking**: Monitor resolution status (Resolved vs. Unresolved) and activity logs.

### 📧 Email Notifications
- **Automated Confirmations**: Send feedback submission receipts smoothly using **Resend** and **React Email**.
- **User Engagement**: Keep users informed that their voice was heard.

### 📈 Analytics Dashboard
- Visual statistics and real-time filtering.
- Overview cards for quick performance insights.
- Data visualization using **Recharts**.

### 🎨 User Interface
- Modern, responsive design utilizing **Tailwind CSS v4** and **Shadcn UI**.
- Dark/Light theme support via `next-themes`.
- Robust form validation with **Zod** and **React Hook Form**.

---

## <a id="tech-stack"></a>🛠 Tech Stack

### Client / Frontend
- **Next.js 16** (App Router) - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first styling
- **Shadcn UI & Radix UI** - Accessible and customizable UI components
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form management & validation

### Server / Native
- **Next.js Server Actions** - Backend logic and API routes
- **Prisma** - Typescript-first ORM
- **PostgreSQL** - Relational Database
- **Clerk** - Authentication provider
- **Google Generative AI (Gemini)** - LLM integration
- **Resend & React Email** - Email delivery system

---

## <a id="getting-started"></a>🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Neon or local pg)
- Clerk Account
- Gemini API Key
- Resend Account

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/reviewradar.git
cd reviewradar
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Prisma
```bash
npm run postinstall
npx prisma db push
```

---

## <a id="configuration"></a>⚙️ Configuration

Create a `.env` file in the root directory and add the following context:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key_here"

# Resend Email Delivery
RESEND_API_KEY="re_..."
```

---

## <a id="usage"></a>💻 Usage

### Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
npm start
```

---

## <a id="project-structure"></a>📁 Project Structure

```text
reviewradar/
├── app/               # Next.js App Router (Pages, Layouts, API Routes)
│   ├── actions/       # Server Actions (Feedback, AI generation)
│   ├── api/           # API endpoints (if any)
│   ├── dashboard/     # Protected Dashboard layout and pages
│   └── ...
├── components/        # Reusable React components
│   ├── ui/            # Shadcn UI components
│   ├── admin/         # Admin-specific components
│   └── analyst/       # AI Analytics components
├── prisma/            # Database schema & migrations
│   └── schema.prisma  # Prisma configuration
├── public/            # Static assets
├── .env               # Environment variables (ignored in git)
├── next.config.ts     # Next.js configurations
├── package.json       # Project dependencies and scripts
└── tailwind.config.ts # Tailwind CSS settings
```
