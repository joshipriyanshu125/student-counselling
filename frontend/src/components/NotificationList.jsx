import { useNavigate } from "react-router-dom"
import { Video, Phone, Bell, Calendar, MessageSquare, Clock } from "lucide-react"


import { canJoinMeeting } from "../utils/canJoinMeeting"
import toast from "react-hot-toast"

function NotificationList({ notifications, markAsRead }) {

    const navigate = useNavigate()

    if (notifications.length === 0) {
        return (
            <div className="p-6 text-center text-slate-400">
                No notifications yet
            </div>
        )
    }

    return (
        <div className="max-h-80 overflow-y-auto">

            {notifications.map((n, idx) => {
                const isMeeting = n.type === "meeting_started"
                const apt = n.appointmentId
                
                // Determine icon and color based on type
                const getIcon = () => {
                    if (isMeeting) return <Video size={16} className="text-emerald-500" />
                    if (n.message?.toLowerCase().includes("appointment")) return <Calendar size={16} className="text-indigo-500" />
                    if (n.message?.toLowerCase().includes("message")) return <MessageSquare size={16} className="text-blue-500" />

                    return <Bell size={16} className="text-slate-400" />
                }

                return (
                    <div
                        key={n._id || idx}
                        onClick={() => !n.read && markAsRead(n._id)}
                        className={`p-4 border-b last:border-b-0 transition-all duration-200 cursor-pointer relative group
                            ${!n.read ? "bg-indigo-50/40 hover:bg-indigo-50/60" : "hover:bg-slate-50 opacity-80 hover:opacity-100"}`}
                    >
                        {!n.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                        )}

                        <div className="flex gap-3">
                            <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!n.read ? "bg-white shadow-sm" : "bg-slate-100"}`}>
                                {getIcon()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-sm leading-snug ${!n.read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                                        {n.message}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <Clock size={10} />
                                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Recently"}
                                    </div>

                                    {!n.read && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(n._id);
                                            }}
                                            className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                </div>

                                {/* Join Now button for meeting notifications */}
                                {isMeeting && apt?.roomId && (
                                    <div className="mt-3">
                                        {apt.status === "completed" ? (
                                            <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                                                Session Ended
                                            </span>
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
                                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-xl transition-all shadow-sm ${
                                                    apt.status !== "completed" && (apt.isStarted || canJoinMeeting(apt.date, apt.time))
                                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] active:scale-95"
                                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                            >
                                                {apt.type === "video" ? <Video size={12} /> : <Phone size={12} />}
                                                Join Now
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}


        </div>
    )
}

export default NotificationList