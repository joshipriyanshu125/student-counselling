import { Bell, Video, Phone, Calendar, Trash2, Check, Clock } from "lucide-react"
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

    // Poll for updates (e.g. meeting starts)
    useEffect(() => {
        const interval = setInterval(fetchNotifications, 5000)
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

    const dismissNotification = async (id) => {
        try {
            await API.delete(`/notifications/${id}`)
            setNotifications(prev => prev.filter(n => n._id !== id))
            toast.success("Notification dismissed")
        } catch (error) {
            toast.error("Failed to dismiss notification")
        }
    }

    const markAllAsRead = async () => {
        try {
            await API.patch("/notifications/read-all")
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            toast.success("All notifications marked as read")
        } catch (error) {
            toast.error("Failed to mark all as read")
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
            {/* Page Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        Notifications
                        {notifications.some(n => !n.read) && (
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse">
                                {notifications.filter(n => !n.read).length} NEW
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Stay updated with your latest counselling activity.
                    </p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs font-black uppercase text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                    >
                        <Check size={14} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((n) => {

                        const isMeeting = n.type === "meeting_started"
                        const apt = n.appointmentId

                        return (
                            <div
                                key={n._id}
                                className={`group bg-white border rounded-[2rem] p-6 flex items-start gap-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden
                                    ${isMeeting && !n.read
                                        ? "border-emerald-200 bg-emerald-50/20"
                                        : !n.read
                                            ? "border-indigo-100 bg-indigo-50/20"
                                            : "border-slate-100 opacity-80 hover:opacity-100"}`}
                            >
                                {/* Unread Indicator */}
                                {!n.read && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isMeeting ? "bg-emerald-500" : "bg-indigo-600"}`}></div>
                                )}

                                <div className={`p-4 rounded-2xl flex-shrink-0 shadow-sm ${isMeeting && !n.read
                                    ? "bg-emerald-500 text-white"
                                    : !n.read
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-400"}`}
                                >
                                    {isMeeting
                                        ? (apt?.type === "video" ? <Video size={24} /> : <Phone size={24} />)
                                        : <Bell size={24} />
                                    }
                                </div>

                                <div className="flex-grow pt-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-grow">
                                            <p className={`text-lg leading-snug mb-2 ${isMeeting && !n.read
                                                ? "text-emerald-900 font-bold"
                                                : !n.read
                                                    ? "text-slate-900 font-bold"
                                                    : "text-slate-600 font-medium"}`}
                                            >
                                                {n.message}
                                            </p>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                    <Clock size={12} />
                                                    {new Date(n.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                
                                                {!n.read && (
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${isMeeting ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                                                        Unread
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!n.read && (
                                                <button
                                                    onClick={() => markAsRead(n._id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                    title="Mark as Read"
                                                >
                                                    <Check size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => dismissNotification(n._id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Dismiss"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Join Now button for meeting notifications */}
                                    {isMeeting && apt?.roomId && (
                                        <div className="mt-4">
                                            {apt.status === "completed" ? (
                                                <div className="text-xs font-black uppercase text-slate-400 bg-slate-50 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-slate-100">
                                                    <Clock size={14} />
                                                    Session Finished
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        const canJoinNow = apt.status !== "completed" && (apt.isStarted || canJoinMeeting(apt.date, apt.time))
                                                        if (!canJoinNow) {
                                                            toast.error("Meeting not available yet")
                                                            return
                                                        }
                                                        markAsRead(n._id)
                                                        navigate(`/call/${apt.type}/${apt.roomId}`)
                                                    }}
                                                    className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] px-6 py-3.5 rounded-2xl transition-all shadow-md group/btn ${
                                                        apt.status !== "completed" && (apt.isStarted || canJoinMeeting(apt.date, apt.time))
                                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.02] active:scale-95 shadow-emerald-100"
                                                            : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                                    }`}
                                                >
                                                    {apt.type === "video" ? <Video size={16} /> : <Phone size={16} />}
                                                    Join {apt.type} Meeting Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-[3rem] text-center py-32 px-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Bell size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">All caught up!</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                            Your notification inbox is empty. We'll let you know when something important happens.
                        </p>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Notifications;