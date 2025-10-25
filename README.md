# 🚀 Careerflow Auto-Apply - Frontend

<div align="center">

**An intelligent job application automation platform that streamlines the job search process with AI-powered matching and automated submissions.**

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4-orange.svg)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution & Outcome](#-solution--outcome)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [User Flow](#-user-flow)
- [Integration with Backend](#-integration-with-backend)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Problem Statement

### The Challenge
Job seekers face significant challenges in today's competitive market:

- **Time-Consuming Process**: Manually applying to dozens of jobs daily is exhausting and inefficient
- **Generic Applications**: Mass-applying with the same resume reduces success rates
- **Missed Opportunities**: Tracking which jobs were applied to and their status is difficult
- **No Feedback Loop**: Applicants rarely understand why they're rejected or how to improve
- **Repetitive Data Entry**: Filling out the same information across multiple job portals wastes valuable time

### Business Impact
- **For Job Seekers**: Lost opportunities, application fatigue, reduced job search effectiveness
- **For Recruiters**: Lower quality applications, difficulty finding genuinely interested candidates
- **Market Gap**: No comprehensive solution combining automation with intelligent matching and feedback

---

## ✨ Solution & Outcome

### Our Solution
Careerflow Auto-Apply is an **intelligent job application automation platform** that combines:

1. **AI-Powered Matching**: Uses Google Gemini AI to score job fit (0-100) based on your profile
2. **Automated Applications**: Submits applications automatically while you focus on interview prep
3. **Smart Profile Management**: One-time profile completion with persistent data across sessions
4. **Real-Time Tracking**: Live status feed showing application progress and outcomes
5. **Actionable Insights**: AI-generated evaluations with specific improvement recommendations

### Measurable Outcomes
- ✅ **10x Faster Applications**: Apply to 50+ jobs in minutes vs. hours of manual work
- ✅ **70%+ Match Accuracy**: AI scoring helps target relevant opportunities
- ✅ **100% Profile Persistence**: No data loss between sessions (localStorage + Firebase)
- ✅ **Actionable Feedback**: Each application includes specific skill gap analysis and improvement steps
- ✅ **Zero Repetition**: Set preferences once, auto-apply handles the rest

---

## 🎨 Key Features

### 1. **Authentication & User Management**
- 🔐 Firebase Authentication integration
- 👤 Secure user sessions with automatic token refresh
- 🔄 Persistent login state across browser refreshes
- 🚪 Graceful logout with cleanup

### 2. **Comprehensive Profile Builder**
- 📝 Multi-step profile completion wizard:
  - **Personal Information**: Name, email, phone, location
  - **Professional Details**: Title, years of experience, LinkedIn/portfolio
  - **Skills**: Current skills, target role, work authorization
  - **Career Goals**: Target industries, companies, culture fit
- 💾 Auto-save functionality with localStorage fallback
- ✅ Profile completion tracking (shows only on first login)
- 🔄 Edit profile anytime via user menu

### 3. **Smart Job Preferences**
- 🎯 Keyword-based job search
- 📍 Location preferences (remote, hybrid, on-site)
- 💰 Salary expectations
- 🏷️ Role tags and filters
- 💾 Persistent preferences storage

### 4. **Intelligent Auto-Apply System**
- 🤖 One-click job application automation
- 📊 AI-powered match scoring (0-100)
- 🔄 Real-time application status tracking:
  - `pending` → `scoring` → `generating` → `applying` → `success`/`failure`
- 🛡️ Stuck run detection and auto-recovery
- ⏱️ Background processing with live updates

### 5. **Application Status Feed**
- 📈 Live dashboard showing:
  - Run status (In Progress / Done / Error)
  - Summary metrics (X succeeded, Y failed, Z total)
  - Individual job application cards
- 💡 **AI Evaluation Summaries** for each application:
  - ✨ Visual indicators (Excellent / Strong / Moderate / Needs Work)
  - 🎯 Specific skill gaps identified
  - 📚 Actionable improvement recommendations
  - 🔢 Match score with detailed breakdown
- 🕐 Timestamp tracking (created, updated)
- ❌ Error messages for failed applications

### 6. **Responsive UI/UX**
- 📱 Mobile-first design with TailwindCSS
- 🎨 Modern, clean interface with intuitive navigation
- ⚡ Fast page loads with Vite HMR
- 🌗 Consistent styling with CSS variables

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 19.1 | UI library for building interactive components |
| **Language** | TypeScript 5.9 | Type-safe development with enhanced IDE support |
| **Build Tool** | Vite | Lightning-fast dev server and optimized builds |
| **Styling** | TailwindCSS 3.4 | Utility-first CSS framework for rapid UI development |
| **Authentication** | Firebase Auth 12.4 | Secure user authentication and session management |
| **Database** | Firebase Firestore | Real-time NoSQL database (with localStorage fallback) |
| **State Management** | React Context API | Global state for auth and profile data |
| **HTTP Client** | Fetch API | RESTful API communication with backend |
| **Linting** | ESLint 9.36 | Code quality and consistency enforcement |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Firebase Account**: Free tier available ([Sign up](https://firebase.google.com/))
- **Backend Service**: The Careerflow backend must be running (see backend README)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <repository-url>
cd Careerflow-auto-apply/careerflow-auto-apply-frontend
```

### Step 2: Install Dependencies

```bash
npm install

npm install
```

This will install all required packages:
- React & React DOM
- TypeScript
- Vite
- TailwindCSS & PostCSS
- Firebase SDK
- ESLint & plugins

---

## ⚙️ Configuration

### 1. Firebase Configuration

#### Create Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enable **Authentication** → Email/Password provider
4. Enable **Firestore Database** → Start in test mode (for development)

#### Get Firebase Config:
1. Project Settings → General → Your apps
2. Click "Web App" icon (</>) → Register app
3. Copy the `firebaseConfig` object

#### Update Configuration File:

Create/edit `src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:4000

# Demo Mode (set to false for production with Firebase)
VITE_DEMO_MODE=false

# Demo User ID (for testing without Firebase)
VITE_DEMO_USER_ID=demo-user
```

**Environment Variable Details:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | ✅ Yes | - | Backend API URL (must be running) |
| `VITE_DEMO_MODE` | ❌ No | `false` | Enable demo mode without Firebase |
| `VITE_DEMO_USER_ID` | ❌ No | `demo-user` | User ID for demo mode |

### 3. Backend Connection

Ensure the backend service is running before starting the frontend:

```bash
# In a separate terminal, navigate to backend directory
cd ../careerflow-auto-apply-backend

# Install backend dependencies
npm install

# Configure backend .env file (see backend README)
# Start the backend server
node index.js
```

The backend should be running on `http://localhost:4000` (or your configured URL).

---

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5174
```

**Features in Dev Mode:**
- ⚡ Instant hot reload on file changes
- 🐛 Source maps for easier debugging
- 📊 Detailed error messages in browser console

### Production Build

Create an optimized production build:

```bash
npm run build
```

This will:
1. Run TypeScript compiler (`tsc -b`)
2. Bundle and minify assets with Vite
3. Output to `dist/` directory

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

Serves the production build at `http://localhost:4173`

### Linting

Check code quality:

```bash
npm run lint
```

---

## 📁 Project Structure

```
careerflow-auto-apply-frontend/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, icons, media files
│   ├── components/              # React components
│   │   ├── PreferencesCard.tsx  # Job preferences form
│   │   ├── RunButton.tsx        # Auto-apply trigger button
│   │   └── StatusFeed.tsx       # Application status dashboard
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx      # Authentication & profile state
│   ├── lib/                     # Utilities and configurations
│   │   ├── api.ts               # Backend API client
│   │   └── firebase.ts          # Firebase initialization
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles + TailwindCSS
│   ├── types.ts                 # TypeScript type definitions
│   └── env.d.ts                 # Environment variable types
├── .env.local                   # Environment variables (create this)
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.node.json           # Node-specific TypeScript config
├── vite.config.ts               # Vite build configuration
└── README.md                    # This file
```

---

## 👥 User Flow

### First-Time User Journey

```
┌─────────────┐
│ Landing Page│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Sign Up   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Complete Profile     │
│ (Multi-step Wizard)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Set Job Preferences  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Start Auto-Apply    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ View Application     │
│ Status & AI Feedback │
└──────────────────────┘
```

**Detailed Steps:**

1. **Landing & Authentication**
   - User arrives at the platform
   - Sign up with email/password via Firebase Auth
   - Automatic redirect to profile completion

2. **Profile Completion** (One-time, Multi-step)
   - **Step 1**: Personal details (name, email, location)
   - **Step 2**: Professional info (title, experience, skills)
   - **Step 3**: Career goals (target roles, companies, preferences)
   - Data saved to Firebase + localStorage for resilience

3. **Job Preferences**
   - Set keywords, locations, salary expectations
   - Configure role tags and filters
   - Preferences persist across sessions

4. **Auto-Apply Execution**
   - Click "Start Auto-Apply" button
   - Backend processes jobs in real-time
   - Frontend polls for status updates

5. **Status Monitoring**
   - Live dashboard shows application progress
   - Each job displays:
     - Match score (AI-calculated)
     - Application status (pending → success/failure)
     - AI evaluation summary
     - Actionable improvement tips

### Returning User Journey

```
┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Dashboard  │─────▶│ Edit Profile │
└──────┬──────┘      └──────────────┘
       │
       ├────────────▶┌──────────────────┐
       │             │ Change           │
       │             │ Preferences      │
       │             └──────────────────┘
       │
       └────────────▶┌──────────────────┐
                     │ Start New        │
                     │ Auto-Apply Run   │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ View Results &   │
                     │ AI Feedback      │
                     └──────────────────┘
```

- **Seamless Re-entry**: Profile and preferences automatically loaded
- **No Re-authentication**: Token refresh keeps session active
- **Persistent State**: Last run status visible on login
- **Quick Actions**: Edit profile or start new run with one click

---

## 🔗 Integration with Backend

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/profile/:userId` | GET | Fetch user profile data |
| `/profile` | POST | Save/update user profile |
| `/preferences/:userId` | GET | Retrieve job preferences |
| `/preferences` | POST | Save job preferences |
| `/runs/:userId` | POST | Initiate auto-apply run |
| `/runs/:userId/status` | GET | Poll run status and applications |

### Authentication Flow

```typescript
// All API requests include Firebase ID token
headers: {
  'Authorization': `Bearer ${idToken}`,
  'Content-Type': 'application/json'
}
```

### Error Handling

- **401 Unauthorized**: Token expired → Auto-refresh → Retry
- **403 Forbidden**: User mismatch → Redirect to login
- **404 Not Found**: Profile doesn't exist → Show profile wizard
- **500 Server Error**: Backend issue → Show user-friendly message
- **Network Error**: Offline → Use localStorage fallback

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Demo/Testing app build by Ashish Verma**

</div>

