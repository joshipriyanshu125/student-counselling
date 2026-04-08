import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import NotificationList from "./NotificationList"
import API from "../api/api"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"


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

        } catch {
            // Silently fail on poll errors (only toast on first load)
            setNotifications(prev => prev)
        }

    }

    // Initial fetch
    useEffect(() => {
        fetchNotifications()
    }, [])

    // Real-time update listener
    useEffect(() => {
        const handleRefresh = () => fetchNotifications()
        window.addEventListener("REFRESH_NOTIFICATIONS", handleRefresh)
        return () => window.removeEventListener("REFRESH_NOTIFICATIONS", handleRefresh)
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


    /* Dismiss a notification */

    const dismissNotification = async (id) => {

        try {
            console.log("Dismissing notification ID:", id);
            const res = await API.delete(`/notifications/${id}`)
            console.log("Dismiss response:", res.data);

            setNotifications(prev =>
                Array.isArray(prev)
                    ? prev.filter(n => n._id !== id)
                    : []
            )

            toast.success("Notification dismissed")

        } catch (error) {
            console.error("Dismiss error:", error);
            const msg = error.response?.data?.message || "Failed to dismiss notification";
            toast.error(msg);
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
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <NotificationList
                            notifications={Array.isArray(notifications) ? notifications : []}
                            markAsRead={markAsRead}
                            dismissNotification={dismissNotification}
                        />

                        <div className="p-3 border-t bg-slate-50/30 text-center">
                            <Link 
                                to="/notifications" 
                                onClick={() => setOpen(false)}
                                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                            >
                                View All Notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    )
}

export default NotificationDropdown;
