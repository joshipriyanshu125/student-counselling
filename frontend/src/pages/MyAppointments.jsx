import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Phone, Calendar, Clock, User, Plus } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import API from "../api/api";
import toast from "react-hot-toast";
import { canJoinMeeting } from "../utils/canJoinMeeting"; // ✅ UPDATED

const MyAppointments = () => {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("All");
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await API.get("/appointments/my", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAppointments(res.data.data);

            } catch (error) {

                console.error(error);
                toast.error("Failed to load appointments");

            }

        };

        fetchAppointments();

    }, []);

    const tabs = ["All", "Upcoming", "Past"];

    return (
        <div className="pb-12">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        My Appointments
                    </h1>
                    <p className="mt-2 text-slate-500 font-medium text-lg">
                        Manage and track your counselling sessions
                    </p>
                </div>

                <button
                    onClick={() => navigate('/book-appointment')}
                    className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-sky-100 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Book New Session
                </button>
            </div>

            {/* Tabs Filter */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mb-10 border border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            activeTab === tab
                                ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {(() => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    
                    const filtered = appointments.filter((apt) => {
                        const aptDate = new Date(apt.date);
                        aptDate.setHours(0, 0, 0, 0);
                        
                        if (activeTab === "Upcoming") return aptDate >= now;
                        if (activeTab === "Past") return aptDate < now;
                        return true;
                    }).sort((a, b) => {
                        if (activeTab === "Past") return new Date(b.date) - new Date(a.date);
                        return new Date(a.date) - new Date(b.date);
                    });

                    if (filtered.length === 0) {
                        return (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center shadow-sm">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Calendar className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                                        {activeTab === "Upcoming" ? "No upcoming appointment" : `No ${activeTab.toLowerCase()} appointments`}
                                    </h3>
                                    <p className="text-slate-500 font-medium mb-8 text-lg">
                                        {activeTab === "Upcoming" 
                                            ? "Book a new one right rn to continue your journey." 
                                            : "You haven't had any sessions in this category yet."}
                                    </p>
                                    <button
                                        onClick={() => navigate('/book-appointment')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 active:scale-95"
                                    >
                                        Book New Session
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    return filtered.map((apt) => (
                        <div
                            key={apt._id}
                            className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300">
                                        <User className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-800 tracking-tight">
                                            {apt.counsellor?.fullName || "Professional Counsellor"}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-1.5 font-bold text-slate-500 text-sm">
                                            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px]">{apt.type === "video" ? "Video Call" : apt.type === "audio" ? "Audio Call" : "In-Person"}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="flex items-center gap-1.5"><Calendar size={15} /> {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="flex items-center gap-1.5"><Clock size={15} /> {apt.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={apt.status} />
                            </div>

                            {/* 🔥 JOIN BUTTON */}
                            {apt.status === "approved" && apt.type !== "in-person" && apt.roomId && (
                                <div className="mt-6 ml-[84px]">
                                    <button
                                        onClick={() => {
                                            const canJoinNow = apt.status !== "completed" && (apt.isStarted || canJoinMeeting(apt.date, apt.time))
                                            if (!canJoinNow) {
                                                toast.error("Meeting not available yet")
                                                return
                                            }
                                            navigate(`/call/${apt.type}/${apt.roomId}`, { replace: true })
                                        }}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wide transition-all shadow-md ${
                                            apt.status !== "completed" && (apt.isStarted || canJoinMeeting(apt.date, apt.time))
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                        }`}
                                        disabled={apt.status === "completed" || (!apt.isStarted && !canJoinMeeting(apt.date, apt.time))}
                                    >
                                        <Video size={18} />
                                        Join {apt.type} session
                                    </button>
                                </div>
                            )}

                            {apt.status === "completed" && (
                                <div className="mt-6 ml-[84px]">
                                    <div className="flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-[0.1em] bg-slate-50 text-slate-400 border border-dashed border-slate-200 w-fit">
                                        <CheckCircle size={18} className="text-emerald-500" />
                                        Session Completed
                                    </div>
                                </div>
                            )}
                        </div>
                    ));
                })()}
            </div>

        </div>
    );
};

export default MyAppointments;