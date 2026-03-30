import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import CounsellorAppointments from "./pages/CounsellorAppointments";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import Sessions from "./pages/Sessions";
import CreateSession from "./pages/CreateSession";
import SessionDetails from "./pages/SessionDetails";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

/* ✅ CALL PAGE */
import CallPage from "./pages/CallPage";

import MainLayout from "./layouts/MainLayout";
import PageTransition from "./components/PageTransition";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Authentication Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />

        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />

        {/* ✅ CALL ROUTE (FULL SCREEN - NO SIDEBAR) */}
        <Route
          path="/call/:type/:roomId"
          element={
            <PageTransition>
              <CallPage />
            </PageTransition>
          }
        />

        {/* Main App Routes */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <MainLayout>
              <PageTransition>
                <BookAppointment />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <MainLayout>
              <PageTransition>
                <MyAppointments />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/counsellor-dashboard"
          element={
            <MainLayout>
              <PageTransition>
                <CounsellorDashboard />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/counsellor-appointments"
          element={
            <MainLayout>
              <PageTransition>
                <CounsellorAppointments />
              </PageTransition>
            </MainLayout>
          }
        />

        {/* Sessions */}
        <Route
          path="/sessions"
          element={
            <MainLayout>
              <PageTransition>
                <Sessions />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/sessions/:id"
          element={
            <MainLayout>
              <PageTransition>
                <SessionDetails />
              </PageTransition>
            </MainLayout>
          }
        />

        <Route
          path="/create-session"
          element={
            <MainLayout>
              <PageTransition>
                <CreateSession />
              </PageTransition>
            </MainLayout>
          }
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={
            <MainLayout>
              <PageTransition>
                <Feedback />
              </PageTransition>
            </MainLayout>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <MainLayout>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </MainLayout>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </MainLayout>
          }
        />

        {/* ✅ NEW: ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <MainLayout>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </MainLayout>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

export default App;