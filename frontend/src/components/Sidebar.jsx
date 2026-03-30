
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    CalendarPlus,
    History,
    Star,
    Bell,
    User,
    GraduationCap,
    CheckSquare
} from "lucide-react";

function Sidebar() {

    const location = useLocation();

    // get role from localStorage
    const role = localStorage.getItem("role");

    // student menu
    const studentLinks = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Appointments", path: "/my-appointments", icon: <Calendar className="w-5 h-5" /> },
        { name: "Book Appointment", path: "/book-appointment", icon: <CalendarPlus className="w-5 h-5" /> },
        { name: "Sessions", path: "/sessions", icon: <History className="w-5 h-5" /> },
        { name: "Feedback", path: "/feedback", icon: <Star className="w-5 h-5" /> },
        { name: "Notifications", path: "/notifications", icon: <Bell className="w-5 h-5" /> },
    ];

    // counsellor menu
    const counsellorLinks = [
        { name: "Counsellor Dashboard", path: "/counsellor-appointments", icon: <CheckSquare className="w-5 h-5" /> },
    ];

    const accountLinks = [
        { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    ];

    // choose menu based on role
    const mainLinks = role === "counsellor" ? counsellorLinks : studentLinks;

    return (
        <div className="w-64 bg-[#5452eb] text-white h-screen flex flex-col hidden lg:flex">

            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <GraduationCap className="text-[#5452eb] w-6 h-6" />
                </div>
                <div>
                    <span className="text-xl font-bold block leading-tight">CounselHub</span>
                    <span className="text-xs text-indigo-200 block">
                        {role === "counsellor" ? "Counsellor Portal" : "Student Support"}
                    </span>
                </div>
            </div>

            <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">

                {/* Main Menu */}
                <div>
                    <p className="px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                        Main Menu
                    </p>

                    <div className="space-y-1">
                        {mainLinks.map((link) => {

                            const isActive = location.pathname.startsWith(link.path);

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${isActive
                                            ? "bg-[#4338ca] text-white font-medium shadow-inner"
                                            : "text-indigo-100 hover:bg-white/10"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            );

                        })}
                    </div>
                </div>

                {/* Account */}
                <div>
                    <p className="px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                        Account
                    </p>

                    <div className="space-y-1">
                        {accountLinks.map((link) => {

                            const isActive = location.pathname.startsWith(link.path);

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${isActive
                                            ? "bg-[#4338ca] text-white font-medium shadow-inner"
                                            : "text-indigo-100 hover:bg-white/10"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            );

                        })}
                    </div>
                </div>

            </div>

            {/* Support Button */}
            <div className="p-4">
                <button className="w-full bg-white/10 hover:bg-white/20 text-indigo-100 py-3 rounded-xl text-sm font-medium transition-colors text-left px-4">
                    Need help? Contact support
                </button>
            </div>

        </div>
    );
}

export default Sidebar;
