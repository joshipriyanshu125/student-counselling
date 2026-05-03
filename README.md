# 🧠 Student Counselling Platform

A full-stack web application designed to support students by connecting them with professional counsellors for mental health guidance, emotional support, and personal development.

---

## 🚀 Live Demo

* 🌐 Frontend (Vercel): https://student-counselling.vercel.app
* 🔧 Backend (Render): https://student-counselling-e39x.onrender.com

---

## 📌 Features

* 🔐 User Authentication (Register & Login)
* 👨‍🎓 Student & Counsellor Roles
* 💬 Secure Communication (Chat/Interaction)
* 📅 Appointment Management
* 🧾 Feedback System
* 🔔 Notifications
* 🧠 Mental Health Support Platform

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* CSS / Tailwind

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```
student-counselling/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
└── README.md
```

---

### 🌐 Frontend (.env)

```
VITE_API_URL=https://student-counselling-e39x.onrender.com
```

---

### 2. Install dependencies

#### Backend

```
cd backend
npm install
npm start
```

#### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🔗 API Base URL

```
https://student-counselling-e39x.onrender.com/api
```

---

## 🔒 Security Features

* Password hashing (bcrypt)
* JWT-based authentication
* Protected routes
* Environment variable protection
