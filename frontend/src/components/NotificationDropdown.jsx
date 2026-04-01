import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import NotificationList from "./NotificationList"
import API from "../api/api"
import toast from "react-hot-toast"

function NotificationDropdown() {

    const [open, setOpen] = useState(false)

    const dropdownRef = useRef(null)

    // Always initialize as array
    const [notifications, setNotifications] = useState([])

    // Safe unread count
    const unreadCount = Array.isArray(notifications)
        ? notifications.filter(n => !n.read).length
        : 0

    // Check if there are unread meeting notifications (for pulse animation)
    const hasMeetingAlert = Array.isArray(notifications)
        ? notifications.some(n => !n.read && n.type === "meeting_started")
        : false


    /* Fetch notifications from backend */
    const fetchNotifications = async () => {

        try {

            const res = await API.get("/notifications")

            // Ensure notifications is always an array
            const data = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data) 
                    ? res.data 
                    : []

            setNotifications(data)

        } catch (error) {
            // Silently fail on poll errors (only toast on first load)
            setNotifications(prev => prev)
        }

    }

    // Initial fetch
    useEffect(() => {
        fetchNotifications()
    }, [])

    // Poll every 3 seconds for faster meeting alerts when counsellor starts the session
    useEffect(() => {
        const interval = setInterval(fetchNotifications, 3000)
        return () => clearInterval(interval)
    }, [])


    /* Mark notification as read */

    const markAsRead = async (id) => {

        try {

            await API.patch(`/notifications/${id}/read`)

            setNotifications(prev =>
                Array.isArray(prev)
                    ? prev.map(n =>
                        n._id === id ? { ...n, read: true } : n
                    )
                    : []
            )

        } catch (error) {

            toast.error("Failed to update notification")

        }

    }


    /* Mark all notifications as read */

    const markAllAsRead = async () => {

        try {

            await API.patch("/notifications/read-all")

            setNotifications(prev =>
                Array.isArray(prev)
                    ? prev.map(n => ({ ...n, read: true }))
                    : []
            )

            toast.success("All marked as read")

        } catch (error) {

            toast.error("Failed to update notifications")

        }

    }



    /* Close dropdown when clicking outside */

    useEffect(() => {

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])


    return (

        <div ref={dropdownRef} className="relative">

            {/* Bell Button */}

            <button
                onClick={() => setOpen(!open)}
                className={`relative p-2 rounded-full hover:bg-slate-100 transition ${hasMeetingAlert ? "animate-pulse" : ""}`}
            >

                <Bell size={20} className={hasMeetingAlert ? "text-green-600" : "text-slate-600"} />

                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${hasMeetingAlert ? "bg-green-500" : "bg-red-500"}`}>
                        {unreadCount}
                    </span>
                )}

            </button>

            {/* Dropdown Panel */}

            {open && (

                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50">

                    <div className="p-4 border-b font-semibold text-slate-700 flex justify-between items-center">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-indigo-600 hover:underline font-normal"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <NotificationList
                        notifications={Array.isArray(notifications) ? notifications : []}
                        markAsRead={markAsRead}
                    />

                </div>

            )}

        </div>
    )
}

export default NotificationDropdown;
