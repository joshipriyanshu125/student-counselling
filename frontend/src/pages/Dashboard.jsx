import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MessageSquare, Users, Star, ArrowRight, User, Clock, Video } from "lucide-react"; // ✅ ADDED Video
import StatusBadge from "../components/StatusBadge";
import { AreaTrendsChart, DonutPieChart, BarTrendsChart } from "../components/DashboardCharts";
import { DashboardStatSkeleton, AppointmentCardSkeleton, ChartSkeleton } from "../components/SkeletonCards";
import API from "../api/api";
import { useState, useEffect, useMemo } from "react";
import { canJoinMeeting } from "../utils/canJoinMeeting";
import toast from "react-hot-toast";

// ✅ ADDED
import SupportChat from "../components/SupportChat";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [trendView, setTrendView] = useState("monthly");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await API.get("/users/me");
                if (profileRes.data) {
                    const name = profileRes.data.fullName
                        ? profileRes.data.fullName.split(" ")[0]
                        : profileRes.data.email.split("@")[0];
                    setUserName(name);
                }

                const [aptRes, feedbackRes] = await Promise.all([
                    API.get("/appointments/my"),
                    API.get("/feedback/student")
                ]);

                if (aptRes.data?.success) {
                    setAppointments(aptRes.data.data);
                }

                if (feedbackRes.data?.success) {
                    setFeedbacks(feedbackRes.data.data);
                }

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const total = appointments.length;

        // ✅ FIXED (strictly completed)
        const completed = appointments.filter(
            a => a.status === "completed"
        ).length;

        const counsellors = new Set(
            appointments.filter(a => a.counsellor).map(a => a.counsellor._id || a.counsellor)
        ).size;

        const avgRating = feedbacks.length > 0
            ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
            : "0.0";

        const thisMonthCount = appointments.filter(a => new Date(a.date) >= startOfMonth).length;

        // ✅ FIXED
        const thisWeekCompleted = appointments.filter(
            a =>
                a.status === "completed" &&
                new Date(a.updatedAt) >= startOfWeek
        ).length;

        return { total, completed, counsellors, avgRating, thisMonthCount, thisWeekCompleted };
    }, [appointments, feedbacks]);

    const notifications = [
        { id: 1, title: "Welcome to CounselHub! Your dashboard is now live.", time: "Just now" },
        { id: 2, title: "Check your profile settings to ensure your information is up to date.", time: "1 hour ago" },
    ];

    const monthlyTrends = useMemo(() => {
        const months = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                monthKey: `${d.getFullYear()}-${d.getMonth()}`,
                Appointments: 0,
                Sessions: 0
            });
        }

        appointments.forEach(apt => {
            const date = new Date(apt.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const m = months.find(item => item.monthKey === key);
            if (m) {
                m.Appointments++;
                // ✅ FIXED (strictly completed)
                if (apt.status === 'completed') m.Sessions++;
            }
        });
        return months;
    }, [appointments]);

    const weeklyTrends = useMemo(() => {
        const days = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            days.push({
                name: d.toLocaleString('default', { weekday: 'short' }),
                dateKey: d.toDateString(),
                Appointments: 0,
                Sessions: 0
            });
        }

        appointments.forEach(apt => {
            const date = new Date(apt.date).toDateString();
            const d = days.find(item => item.dateKey === date);
            if (d) {
                d.Appointments++;
                // ✅ FIXED (strictly completed)
                if (apt.status === 'completed') d.Sessions++;
            }
        });
        return days;
    }, [appointments]);

    const sessionTypes = useMemo(() => {
        const counts = appointments.reduce((acc, apt) => {
            const reason = apt.reason || "General";
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [appointments]);

    const weeklyActivity = useMemo(() => {
        return weeklyTrends.map(d => ({
            name: d.name,
            Booked: d.Appointments,
            Completed: d.Sessions
        }));
    }, [weeklyTrends]);

    const upcomingAppointments = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return appointments
            .filter(apt => {
                const aptDate = new Date(apt.date);
                aptDate.setHours(0, 0, 0, 0);
                return aptDate >= now;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [appointments]);

    return (
        <div className="pb-12 max-w-[1600px] mx-auto">
            {/* Greeting */}
            <div className="mb-10">
                <h1 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight leading-tight">
                    Good morning, {userName || "John"} 👋
                </h1>
                <p className="text-slate-500 mt-2 font-medium text-lg">
                    Here's what's happening with your counselling journey
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <DashboardStatSkeleton key={i} />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <ChartSkeleton />
                        </div>
                        <div className="lg:col-span-2">
                            <ChartSkeleton />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Appointments - Premium Gradient Card */}
                        <div className="relative overflow-hidden bg-[#6366f1] p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 group transition-all duration-500 hover:-translate-y-1">
                            <div className="relative z-10">
                                <p className="text-white/70 font-bold text-[13px] uppercase tracking-[0.1em] mb-2">Total Appointments</p>
                                <h3 className="text-6xl font-black text-white leading-tight">{stats.total}</h3>
                                <div className="mt-6">
                                    <span className="text-white/90 text-[13px] font-bold bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                        +{stats.thisMonthCount} this month
                                    </span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-28 h-28 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-700">
                                <Calendar className="w-12 h-12 text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Sessions Completed */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 group hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-slate-400 font-bold text-[13px] uppercase tracking-[0.1em] mb-2">Sessions Completed</p>
                                    <h3 className="text-6xl font-black text-slate-900 leading-tight">{stats.completed}</h3>
                                </div>
                                <div className="w-16 h-16 bg-indigo-50/50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                    <MessageSquare className="w-8 h-8" strokeWidth={2.5} />
                                </div>
                            </div>
                            <p className="text-indigo-500 text-[13px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                +{stats.thisWeekCompleted} this week
                            </p>
                        </div>

                        {/* Counsellors Seen */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 group hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-slate-400 font-bold text-[13px] uppercase tracking-[0.1em] mb-2">Counsellors Seen</p>
                                    <h3 className="text-6xl font-black text-slate-900 leading-tight">{stats.counsellors}</h3>
                                </div>
                                <div className="w-16 h-16 bg-violet-50/50 rounded-[1.5rem] flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                                    <Users className="w-8 h-8" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Avg. Rating Given */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 group hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-slate-400 font-bold text-[13px] uppercase tracking-[0.1em] mb-2">Avg. Rating Given</p>
                                    <h3 className="text-6xl font-black text-slate-900 leading-tight">{stats.avgRating}</h3>
                                </div>
                                <div className="w-16 h-16 bg-amber-50/50 rounded-[1.5rem] flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                                    <Star className="w-8 h-8" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Appointment Trends Chart */}
                        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                <div>
                                    <h2 className="text-[1.35rem] font-black text-slate-800 tracking-tight">Appointment Trends</h2>
                                </div>
                                <div className="flex p-1 bg-slate-100 rounded-xl">
                                    <button
                                        onClick={() => setTrendView('monthly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${trendView === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setTrendView('weekly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${trendView === 'weekly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Weekly
                                    </button>
                                </div>
                            </div>
                            <AreaTrendsChart
                                data={trendView === 'monthly' ? monthlyTrends : weeklyTrends}
                                lines={[
                                    { name: 'Appointments', dataKey: 'Appointments', stroke: '#6366f1' },
                                    { name: 'Sessions', dataKey: 'Sessions', stroke: '#06b6d4' }
                                ]}
                            />
                        </div>

                        {/* Sessions by Type Chart */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-[1.35rem] font-black text-slate-800 mb-8 tracking-tight">Sessions by Type</h2>
                            <DonutPieChart
                                data={sessionTypes.length > 0 ? sessionTypes : [{ name: 'General', value: 1 }]}
                                colors={['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b']}
                            />
                        </div>
                    </div>

                    {/* Weekly Activity Bar Chart */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-[1.35rem] font-black text-slate-800 tracking-tight">Weekly Activity</h2>
                        </div>
                        <BarTrendsChart
                            data={weeklyActivity}
                            lines={[
                                { name: 'Booked', dataKey: 'Booked', stroke: '#6366f1' },
                                { name: 'Completed', dataKey: 'Completed', stroke: '#06b6d4' }
                            ]}
                        />
                    </div>

                    {/* Upcoming Appointments Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-[1.35rem] font-black text-slate-800 tracking-tight">Upcoming Appointments</h2>
                            <button onClick={() => navigate('/my-appointments')} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                View All <ArrowRight size={16} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingAppointments.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <div className="flex flex-col items-center">
                                        <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                                        <p className="text-slate-800 font-bold text-lg mb-1">No upcoming appointments</p>
                                        <p className="text-slate-500 font-medium mb-4">Looks like you're new here!</p>
                                        <button 
                                            onClick={() => navigate('/book-appointment')} 
                                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                        >
                                            Book your first session
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                upcomingAppointments.slice(0, 3).map((apt) => (
                                    <div key={apt._id} className="flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 group relative">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                                                <User size={28} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-extrabold text-xl text-slate-900 tracking-tight truncate">{apt.counsellor?.fullName || "Counsellor"}</h4>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-400 mt-1 font-bold">
                                                    <span className="flex items-center gap-1.5 uppercase tracking-wider">{apt.type}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Calendar size={14} /> {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="flex items-center gap-1.5 flex-shrink-0"><Clock size={14} /> {apt.time || "10:00 AM"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {apt.status === "approved" && apt.type !== "in-person" && apt.roomId && (
                                            <button
                                                onClick={() => {
                                                    if (!apt.isStarted && !canJoinMeeting(apt.date, apt.time)) {
                                                        toast.error("Meeting not available yet")
                                                        return
                                                    }
                                                    navigate(`/call/${apt.type}/${apt.roomId}`)
                                                }}
                                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                                                    apt.isStarted || canJoinMeeting(apt.date, apt.time)
                                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
                                                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                                }`}
                                                disabled={!apt.isStarted && !canJoinMeeting(apt.date, apt.time)}
                                            >
                                                <Video size={18} />
                                                JOIN {apt.type} SESSION
                                            </button>
                                        )}
                                        
                                        {apt.status === "completed" && (
                                            <div className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-slate-50 text-slate-400 border border-dashed border-slate-200">
                                                Session Completed
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;