import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CounsellorDashboard from "../pages/CounsellorDashboard";
import Appointments from "../pages/Appointments";
import CounsellorAppointments from "../pages/CounsellorAppointments";
import MyAppointments from "../pages/MyAppointments";
import BookAppointment from "../pages/BookAppointment";
import Sessions from "../pages/Sessions";
import Feedback from "../pages/Feedback";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <AuthLayout>
                            <Register />
                        </AuthLayout>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/appointments"
                    element={
                        <MainLayout>
                            <Appointments />
                        </MainLayout>
                    }
                />

                <Route
                    path="/sessions"
                    element={
                        <MainLayout>
                            <Sessions />
                        </MainLayout>
                    }
                />

                <Route
                    path="/feedback"
                    element={
                        <MainLayout>
                            <Feedback />
                        </MainLayout>
                    }
                />

                <Route
                    path="/counsellor-dashboard"
                    element={
                        <MainLayout>
                            <CounsellorDashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/counsellor-appointments"
                    element={
                        <MainLayout>
                            <CounsellorAppointments />
                        </MainLayout>
                    }
                />

                <Route
                    path="/my-appointments"
                    element={
                        <MainLayout>
                            <MyAppointments />
                        </MainLayout>
                    }
                />

                <Route
                    path="/book-appointment"
                    element={
                        <MainLayout>
                            <BookAppointment />
                        </MainLayout>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <MainLayout>
                            <Notifications />
                        </MainLayout>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;