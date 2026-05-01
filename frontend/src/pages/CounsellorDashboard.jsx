import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, CheckCircle, Clock, ArrowRight, Star, TrendingUp } from "lucide-react"
import API from "../api/api"
import toast from "react-hot-toast"
import AppointmentCard from "../components/AppointmentCard"
import { DashboardStatSkeleton, AppointmentCardSkeleton, ChartSkeleton } from "../components/SkeletonCards"
import { AreaTrendsChart, DonutPieChart, BarTrendsChart } from "../components/DashboardCharts";

const CounsellorDashboard = () => {

    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        rejected: 0
    })

    const [trendsData, setTrendsData] = useState([])
    const [typeData, setTypeData] = useState([])
    const [weeklyData, setWeeklyData] = useState([])
    const [trendView, setTrendView] = useState("monthly")
    const [userName, setUserName] = useState("")
    const [isApproved, setIsApproved] = useState(true)

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Fetch Profile for name and approval status
                const profileRes = await API.get("/users/me")
                if (profileRes.data) {
                    setUserName(profileRes.data.fullName?.split(" ")[0] || "")
                    setIsApproved(profileRes.data.isApproved)
                }

                if (profileRes.data?.isApproved) {
                    const res = await API.get("/appointments/counsellor")
                    if (res.data?.success) {
                        const apts = res.data.data
                        setAppointments(apts)
                        setStats({
                            total: apts.length,
                            pending: apts.filter(a => a.status === "pending").length,
                            completed: apts.filter(a => a.status === "completed").length,
                            rejected: apts.filter(a => a.status === "rejected").length,
                        })

                        // Process real monthly trend data
                        const months = [];
                        const now = new Date();
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                            months.push({
                                name: d.toLocaleString('default', { month: 'short' }),
                                monthKey: `${d.getFullYear()}-${d.getMonth()}`,
                                Scheduled: 0,
                                Completed: 0
                            });
                        }

                        apts.forEach(apt => {
                            const date = new Date(apt.date);
                            const key = `${date.getFullYear()}-${date.getMonth()}`;
                            const m = months.find(item => item.monthKey === key);
                            if (m) {
                                m.Scheduled++;
                                if (apt.status === 'completed') m.Completed++;
                            }
                        });
                        setTrendsData(months);

                        // Process session types
                        const reasons = apts.reduce((acc, apt) => {
                            const reason = apt.reason || "General Counselling";
                            acc[reason] = (acc[reason] || 0) + 1;
                            return acc;
                        }, {})
                        setTypeData(Object.entries(reasons).map(([name, value]) => ({ name, value })))

                        // Process real weekly data
                        const days = [];
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date();
                            d.setDate(now.getDate() - i);
                            days.push({
                                name: d.toLocaleString('default', { weekday: 'short' }),
                                dateKey: d.toDateString(),
                                Scheduled: 0,
                                Completed: 0
                            });
                        }

                        apts.forEach(apt => {
                            const date = new Date(apt.date).toDateString();
                            const d = days.find(item => item.dateKey === date);
                            if (d) {
                                d.Scheduled++;
                                if (apt.status === 'completed') d.Completed++;
                            }
                        });
                        setWeeklyData(days);
                    }
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 800) // Small delay for smooth transition
            }
        }

        fetchData()

    }, [])

    const recent = appointments.slice(0, 5)

    const statusStyle = (status) => {
        if (status === "approved") return "bg-emerald-100 text-emerald-700"
        if (status === "rejected") return "bg-red-100 text-red-600"
        return "bg-yellow-100 text-yellow-700"
    }

    if (!isApproved && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-amber-50 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-200 max-w-2xl">
                    <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Registration Under Review</h2>
                    <p className="text-slate-500 font-bold text-lg leading-relaxed mb-8">
                        Welcome to CounselHub! Your registration is currently being reviewed by our administration team. 
                        You'll be able to manage appointments and students once your profile is approved.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-600 font-black uppercase tracking-widest text-xs">
                        <CheckCircle size={16} />
                        Estimated time: 24-48 hours
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-12">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    Welcome, {userName || "Counsellor"} <span className="text-4xl">🩺</span>
                </h1>
                <p className="mt-2 text-slate-500 text-base">
                    Overview of your appointments and student activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {isLoading ? (
                    <>
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                    </>
                ) : (
                    <>
                        <div className="bg-gradient-to-br from-[#4f46e5] to-[#0ea5e9] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                            <h3 className="text-white/90 font-medium mb-1 text-sm">Total Appointments</h3>
                            <p className="text-4xl font-bold mb-4">{stats.total}</p>
                            <p className="text-white/70 text-xs">All time</p>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <h3 className="text-slate-500 font-medium mb-1 text-sm">Pending</h3>
                            <p className="text-4xl font-bold text-slate-800 mb-4">{stats.pending}</p>
                            <p className="text-slate-400 text-xs">Awaiting review</p>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                                <Clock className="w-7 h-7 text-yellow-500" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <h3 className="text-slate-500 font-medium mb-1 text-sm">Completed Sessions</h3>
                            <p className="text-4xl font-bold text-slate-800 mb-4">{stats.completed}</p>
                            <p className="text-slate-400 text-xs">Sessions completed</p>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <h3 className="text-slate-500 font-medium mb-1 text-sm">Total Students</h3>
                            <p className="text-4xl font-bold text-slate-800 mb-4">
                                {[...new Set(appointments.map(a => a.student?._id))].length}
                            </p>
                            <p className="text-slate-400 text-xs">Unique students seen</p>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-purple-500" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Charts Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <ChartSkeleton />
                    <ChartSkeleton />
                    <div className="lg:col-span-2">
                        <ChartSkeleton />
                    </div>
                </div>
            ) : appointments.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Counselling Delivered</h2>
                            <div className="bg-slate-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setTrendView('monthly')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${trendView === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setTrendView('weekly')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${trendView === 'weekly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    Weekly
                                </button>
                            </div>
                        </div>
                        <AreaTrendsChart
                            data={trendView === 'monthly' ? trendsData : weeklyData}
                            lines={[
                                { dataKey: "Scheduled", name: "Scheduled", stroke: "#8b5cf6" },
                                { dataKey: "Completed", name: "Completed", stroke: "#10b981" }
                            ]}
                        />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Student Needs by Category</h2>
                        <div className="flex justify-center items-center">
                            <DonutPieChart
                                data={typeData.length > 0 ? typeData : [{ name: "No Data", value: 1 }]}
                                colors={["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6"]}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 mt-4">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Weekly Activity Synopsis</h2>
                        <BarTrendsChart
                            data={weeklyData}
                            lines={[
                                { dataKey: "Scheduled", name: "Scheduled", stroke: "#8b5cf6" },
                                { dataKey: "Completed", name: "Completed", stroke: "#10b981" }
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* Recent Appointments */}
            <div className="space-y-4">

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Recent Appointments</h2>
                    <button
                        onClick={() => navigate("/counsellor-appointments")}
                        className="text-indigo-600 font-medium text-sm flex items-center hover:text-indigo-700 transition-colors"
                    >
                        Manage all <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        <AppointmentCardSkeleton />
                        <AppointmentCardSkeleton />
                        <AppointmentCardSkeleton />
                    </div>
                ) : recent.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
                        <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No appointments yet</p>
                        <p className="text-sm mt-1">Students will appear here once they book with you</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recent.map((apt) => (
                            <AppointmentCard
                                key={apt._id}
                                appointment={apt}
                                updateStatus={async (id, status) => {
                                    try {
                                        const res = await API.patch(`/appointments/${id}`, { status });
                                        if (res.data?.success) {
                                            toast.success(`Appointment ${status}`);
                                            // Refresh to update stats and list
                                            window.location.reload(); 
                                        }
                                    } catch (err) {
                                        toast.error("Failed to update status");
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}

export default CounsellorDashboard
