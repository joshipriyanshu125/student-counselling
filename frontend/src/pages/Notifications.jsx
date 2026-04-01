import { Bell, Video, Phone, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"
import toast from "react-hot-toast"
import { canJoinMeeting } from "../utils/canJoinMeeting"

function Notifications() {

    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications")
            if (res.data?.success) {
                setNotifications(res.data.data)
            }
        } catch (error) {
            toast.error("Failed to load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    // Poll every 3 seconds for faster meeting alerts
    useEffect(() => {
        const interval = setInterval(fetchNotifications, 3000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/read`)
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            )
        } catch (error) {
            toast.error("Failed to mark notification as read")
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Stay updated with your latest activity.
                    </p>
                </div>
                {notifications.some(n => !n.read) && (
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                        {notifications.filter(n => !n.read).length} New
                    </span>
                )}
            </div>

            {/* Notification List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading your notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((n) => {

                        const isMeeting = n.type === "meeting_started"
                        const apt = n.appointmentId

                        return (
                            <div
                                key={n._id}
                                className={`bg-white border rounded-2xl p-5 flex items-start gap-5 shadow-sm transition-all hover:shadow-md 
                                    ${isMeeting && !n.read
                                        ? "border-green-300 bg-green-50/40 ring-1 ring-green-100"
                                        : !n.read
                                            ? "border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-50"
                                            : "border-slate-100"}`}
                            >
                                <div className={`p-3 rounded-xl flex-shrink-0 ${isMeeting && !n.read
                                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                                    : !n.read
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                        : "bg-slate-100 text-slate-400"}`}
                                >
                                    {isMeeting
                                        ? (apt?.type === "video" ? <Video size={20} /> : <Phone size={20} />)
                                        : <Bell size={20} />
                                    }
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className={`text-[15px] ${isMeeting && !n.read
                                            ? "text-green-800 font-bold"
                                            : !n.read
                                                ? "text-slate-800 font-bold"
                                                : "text-slate-600"}`}
                                        >
                                            {n.message}
                                        </p>
                                        {!n.read && !isMeeting && (
                                            <button
                                                onClick={() => markAsRead(n._id)}
                                                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>

                                    {/* Join Now button for meeting notifications */}
                                    {isMeeting && apt?.roomId && (
                                        apt.status === "completed" ? (
                                            <div className="mt-3 text-sm font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl inline-block shadow-sm">
                                                Meeting Ended
                                            </div>
                                        ) : apt.status === "approved" ? (
                                            <button
                                                onClick={() => {
                                                    // Allow joining if it's a 'meeting_started' type OR within the time window
                                                    if (n.type !== "meeting_started" && !canJoinMeeting(apt.date, apt.time)) {
                                                        toast.error("Meeting not available yet")
                                                        return
                                                    }
                                                    markAsRead(n._id)
                                                    navigate(`/call/${apt.type}/${apt.roomId}`)
                                                }}
                                                className={`mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-all shadow-md ${
                                                    n.type === "meeting_started" || canJoinMeeting(apt.date, apt.time)
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100"
                                                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                                }`}
                                            >
                                                {apt.type === "video" ? <Video size={14} /> : <Phone size={14} />}
                                                JOIN {apt.type} SESSION
                                            </button>
                                        ) : null
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isMeeting && !n.read
                                                ? "bg-green-400"
                                                : !n.read
                                                    ? "bg-indigo-400"
                                                    : "bg-slate-300"}`}
                                            ></div>
                                            {new Date(n.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] text-center py-24 px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No notifications yet</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                            We'll notify you here when there's an update regarding your appointments or profile.
                        </p>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Notifications;