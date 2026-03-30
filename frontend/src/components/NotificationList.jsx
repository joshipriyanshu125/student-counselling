import { useNavigate } from "react-router-dom"
import { Video, Phone } from "lucide-react"
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

            {notifications.map((n) => {

                const isMeeting = n.type === "meeting_started"
                const apt = n.appointmentId // populated with { type, roomId }

                return (
                    <div
                        key={n._id}
                        className={`p-4 border-b hover:bg-slate-50 cursor-pointer
                            ${!n.read && isMeeting ? "bg-green-50 border-l-4 border-l-green-500" :
                                !n.read ? "bg-indigo-50" : ""}`}
                    >

                        <div className="flex justify-between items-start gap-2">

                            <p className={`text-sm ${isMeeting && !n.read ? "text-green-800 font-bold" : "text-slate-700"}`}>
                                {n.message}
                            </p>

                            {!n.read && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(n._id)
                                    }}
                                    className="text-xs text-indigo-600 whitespace-nowrap hover:underline"
                                >
                                    Mark read
                                </button>
                            )}

                        </div>

                        {/* Join Now button for meeting notifications */}
                        {isMeeting && apt?.roomId && (
                            apt.status === "completed" ? (
                                <div className="mt-2 text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                                    Meeting Ended
                                </div>
                            ) : apt.status === "approved" ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (!canJoinMeeting(apt.date, apt.time)) {
                                            toast.error("Meeting not available yet")
                                            return
                                        }
                                        markAsRead(n._id)
                                        navigate(`/call/${apt.type}/${apt.roomId}`)
                                    }}
                                    disabled={!canJoinMeeting(apt.date, apt.time)}
                                    className={`mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                                        canJoinMeeting(apt.date, apt.time)
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                    }`}
                                >
                                    {apt.type === "video" ? <Video size={12} /> : <Phone size={12} />}
                                    JOIN {apt.type} SESSION
                                </button>
                            ) : null
                        )}

                        <span className="text-xs text-slate-400 mt-1 block">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                        </span>

                    </div>
                )

            })}

        </div>
    )
}

export default NotificationList