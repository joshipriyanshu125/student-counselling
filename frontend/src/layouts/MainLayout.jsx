import { useNavigate, useLocation } from "react-router-dom"
import {
    Bell,
    LayoutGrid,
    Calendar,
    BookOpen,
    MessageSquare,
    Star,
    User,
    GraduationCap,
    Users
} from "lucide-react"

import NotificationDropdown from "../components/NotificationDropdown"
import SupportModal from "../components/SupportModal"
import { useState } from "react"

function MainLayout({ children }) {

    const navigate = useNavigate()
    const location = useLocation()

    const [showSupport, setShowSupport] = useState(false)   // ✅ ADDED

    const isCounsellor = localStorage.getItem("role") === "counsellor"

    const studentMenu = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
        { name: "Counsellors", path: "/counsellors", icon: Users },
        { name: "Appointments", path: "/my-appointments", icon: Calendar },
        { name: "Book Appointment", path: "/book-appointment", icon: BookOpen },
        { name: "Sessions", path: "/sessions", icon: MessageSquare },
        { name: "Feedback", path: "/feedback", icon: Star },
        { name: "Notifications", path: "/notifications", icon: Bell },
    ]

    const counsellorMenu = [
        { name: "Dashboard", path: "/counsellor-dashboard", icon: LayoutGrid },
        { name: "Appointments", path: "/counsellor-appointments", icon: Calendar },
        { name: "Sessions", path: "/sessions", icon: MessageSquare },
        { name: "Notifications", path: "/notifications", icon: Bell },
    ]

    const mainMenu = isCounsellor ? counsellorMenu : studentMenu

    const accountMenu = [
        { name: "Profile", path: "/profile", icon: User },
    ]

    return (
        <div className="min-h-screen flex bg-background text-foreground font-sans transition-colors duration-300">

            {/* Sidebar */}
            <aside className="w-64 bg-[#5850ec] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-[#ffffff20] transition-colors duration-300">

                {/* Logo */}
                <div className="p-8 pb-10 flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-lg shadow-indigo-900/20 border border-white/10 shrink-0">
                        <GraduationCap className="text-[#5850ec]" size={28} strokeWidth={2.5} />
                    </div>

                    <div className="overflow-hidden">
                        <h2 className="text-[1.4rem] font-black leading-none tracking-tight text-white mb-1">
                            CounselHub
                        </h2>

                        <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest truncate">
                            {isCounsellor ? "Counsellor Portal" : "Student Support"}
                        </p>
                    </div>
                </div>

                <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">

                    {/* Main Menu */}
                    <div>
                        <p className="text-[11px] font-bold text-white/40 tracking-wider mb-3 px-2 uppercase">
                            Main Menu
                        </p>

                        <nav className="space-y-1.5">
                            {mainMenu.map((item) => {

                                const active = location.pathname.includes(item.path)
                                const Icon = item.icon

                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 ${active
                                            ? "bg-[#4a42c9] text-white font-semibold shadow-sm"
                                            : "text-white/70 hover:bg-[#4a42c9]/50 hover:text-white font-medium"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                        <span className="text-[15px]">
                                            {item.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Account */}
                    <div>
                        <p className="text-[11px] font-bold text-white/40 tracking-wider mb-3 px-2 uppercase">
                            Account
                        </p>

                        <nav className="space-y-1.5">
                            {accountMenu.map((item) => {

                                const active = location.pathname.includes(item.path)
                                const Icon = item.icon

                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 ${active
                                            ? "bg-[#4a42c9] text-white font-semibold shadow-sm"
                                            : "text-white/70 hover:bg-[#4a42c9]/50 hover:text-white font-medium"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                        <span className="text-[15px]">
                                            {item.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                </div>

                {/* ✅ ONLY CHANGE HERE */}
                <div className="p-4 mt-auto">
                    <button
                        onClick={() => setShowSupport(true)}   // ✅ ADDED
                        className="w-full bg-white/10 hover:bg-white/20 text-white/80 py-3.5 px-4 rounded-xl text-[13px] font-medium transition-colors text-left border border-white/5"
                    >
                        Need help? Contact support
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64 h-screen">

                {/* Navbar */}
                <header className="flex justify-between items-center bg-white/80 backdrop-blur-md px-10 py-6 flex-shrink-0 z-30 sticky top-0 border-b border-slate-100">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">
                            {isCounsellor ? "Counsellor Dashboard" : "Student Counselling System"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationDropdown />

                        <div
                            onClick={() => navigate("/profile")}
                            className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-indigo-50 transition-all border border-slate-200"
                        >
                            <User size={20} className="text-slate-600" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 pb-12 overflow-y-auto bg-dashboard-bg flex-1 transition-colors duration-300">
                    {children}
                </main>

            </div>

            {/* ✅ ONLY ADD THIS */}
            {showSupport && (
                <SupportModal onClose={() => setShowSupport(false)} />
            )}

        </div>
    )
}

export default MainLayout;