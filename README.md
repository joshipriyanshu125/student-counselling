# 🧠 Student Counselling Platform

A full-stack **Student Counselling Platform** designed to provide students with a secure and accessible environment to connect with professional counsellors for emotional support, mental health guidance, and personal development.

The platform supports **student and counsellor roles**, authentication, appointments, communication, feedback, notifications, and protected user interactions.

---

## 🌐 Live Application

### Frontend

**Live Website:**
https://student-counselling-virid.vercel.app/

### Backend API

**API Base URL:**
https://student-counselling-e39x.onrender.com/api

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based access control
* Student and Counsellor roles
* Secure session/token handling

---

## 👨‍🎓 Student Features

Students can:

* Create an account
* Login securely
* Manage their profile
* Browse available counsellors
* View counsellor information
* Request/book counselling appointments
* Manage their appointments
* Communicate with counsellors
* Receive notifications
* Submit feedback after counselling sessions
* Access mental health and counselling support

---

## 🧑‍⚕️ Counsellor Features

Counsellors can:

* Create and manage their profile
* Login securely
* View student appointment requests
* Accept or manage appointments
* Manage counselling sessions
* Communicate with students
* Receive notifications
* View student interactions where permitted
* Receive feedback from students

---

## 💬 Communication

The platform provides secure student-counsellor communication to support counselling interactions.

Planned/implemented communication capabilities can include:

* Student-counsellor conversations
* Message history
* User-specific conversations
* Protected communication routes
* Real-time communication support

---

## 📅 Appointment Management

The appointment system allows students and counsellors to manage counselling sessions.

### Students

* Request appointments
* View upcoming appointments
* View appointment status
* Manage/cancel appointments where permitted

### Counsellors

* View appointment requests
* Accept or reject requests
* Manage scheduled sessions
* Track appointment status

### Appointment Status

Typical appointment states include:

```text
Pending
Accepted
Rejected
Cancelled
Completed
```

---

## 🧾 Feedback System

Students can provide feedback about their counselling experience.

The feedback system can support:

* Ratings
* Written feedback
* Counsellor-specific feedback
* Session-related feedback

This helps improve the quality of counselling services.

---

## 🔔 Notifications

The platform supports notifications for important user activities such as:

* New appointment requests
* Appointment acceptance/rejection
* Appointment updates
* New messages
* Feedback-related events
* Other important platform activities

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Axios
* CSS / Tailwind CSS
* JavaScript

## Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt
* Mongoose

## Database

* MongoDB
* MongoDB Atlas

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       Student        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      (Vite)          │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │       Node.js        │
                    │       Render         │
                    └──────────┬───────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
          Authentication   Appointments    Communication
               │               │               │
               └───────────────┼───────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MongoDB         │
                    │      Atlas           │
                    └──────────────────────┘
```

---

# 📂 Project Structure

```text
student-counselling/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── appointmentController.js
│   │   ├── counsellorController.js
│   │   ├── feedbackController.js
│   │   └── notificationController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Message.js
│   │   ├── Feedback.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── counsellorRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

> The exact files and folders may vary depending on the current implementation.

---

# 🚀 Getting Started

Follow the steps below to run the project locally.

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd student-counselling
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

The backend will run locally at:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

---

# 🎨 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a frontend environment file if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🗄️ Database Setup

The project uses **MongoDB Atlas** as its cloud database.

Create a MongoDB database and configure the connection string in the backend `.env` file.

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

The backend uses **Mongoose** to communicate with MongoDB.

---

# 🔗 API

Production API:

```text
https://student-counselling-e39x.onrender.com/api
```

Example API structure:

```text
/api/auth
/api/users
/api/counsellors
/api/appointments
/api/messages
/api/feedback
/api/notifications
```

> Available endpoints depend on the current backend implementation.

---

# 🔒 Security

Security is an important part of the application because the platform handles private student-counsellor interactions.

The application uses:

* 🔐 bcrypt password hashing
* 🎟️ JWT authentication
* 🛡️ Protected API routes
* 👥 Role-based authorization
* 🔑 Environment variables for secrets
* 🚫 `.env` excluded from Git
* 🗄️ MongoDB access through Mongoose
* 🔒 Authenticated user-specific operations

Sensitive credentials should **never** be committed to the repository.

---

# 🌍 Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
```

## Frontend

```env
VITE_API_URL=
```

Production values should be configured through the respective deployment platform's environment-variable settings.

---

# ☁️ Deployment

## Frontend — Vercel

The React/Vite frontend is deployed on Vercel.

**Production URL:**

https://student-counselling-virid.vercel.app/

---

## Backend — Render

The Node.js/Express backend is deployed on Render.

**Production API:**

https://student-counselling-e39x.onrender.com/api

---

## Database — MongoDB Atlas

MongoDB Atlas is used as the production database.

The backend connects to MongoDB Atlas through the `MONGO_URI` environment variable.

---

# 🔄 Application Flow

```text
User
  │
  ▼
Register / Login
  │
  ▼
JWT Authentication
  │
  ▼
Role Detection
  │
  ├───────────────┐
  ▼               ▼
Student        Counsellor
  │               │
  ▼               ▼
Find           Manage
Counsellor     Requests
  │               │
  └───────┬───────┘
          ▼
     Appointment
          │
          ▼
   Counselling Session
          │
          ▼
      Communication
          │
          ▼
       Feedback
          │
          ▼
     Notifications
```

---

# 🎯 Project Goals

The main goals of this project are to:

* Make counselling services more accessible to students
* Provide a secure communication environment
* Connect students with counsellors
* Simplify appointment management
* Improve communication between students and counsellors
* Collect counselling feedback
* Provide timely notifications
* Build a scalable full-stack counselling platform

---

# 🚧 Future Improvements

Potential future enhancements include:

* 💬 Real-time chat using WebSockets/Socket.IO
* 📹 Video counselling sessions
* 📆 Advanced counsellor availability management
* 🔔 Real-time push notifications
* 📱 Progressive Web App / mobile support
* 🤖 AI-powered initial student support
* 🧠 Mental-health resource recommendations
* 📊 Counsellor analytics dashboard
* 📈 Admin dashboard
* 🛡️ Advanced security and audit logging
* 🔎 Advanced counsellor search and filtering
* ⭐ Improved counsellor rating system
* 📅 Calendar integration
* 📧 Email notifications
* 🔑 Password reset and email verification
* 🚨 Emergency-support information and escalation flows

---

# 📌 Important Disclaimer

This platform is designed as a **student counselling and support application** and is not intended to replace emergency medical or psychiatric services.

Users experiencing an immediate emergency should contact their local emergency services or an appropriate qualified professional.

---

# 👨‍💻 Development

Built as a full-stack web application using:

```text
React + Vite
      │
      ▼
Axios
      │
      ▼
Node.js + Express
      │
      ▼
Mongoose
      │
      ▼
MongoDB Atlas
```

---

# 📄 License

This project is intended for educational and development purposes.

Add an appropriate open-source license such as MIT if you plan to distribute the source code publicly.
