import { Search, Bell, LogOut } from "lucide-react";

function Navbar() {
    return (
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center text-slate-400">
                <div className="p-2 border border-slate-200 rounded-md bg-white text-slate-400 mr-4 hidden md:block cursor-pointer hover:bg-slate-50 transition-colors">
                    {/* Placeholder for sidebar toggle on small screens or layout switcher */}
                    <div className="w-4 h-4 border-2 border-current rounded-[2px] opacity-70"></div>
                </div>
                <div className="flex items-center bg-slate-100/50 px-4 py-2.5 w-64 md:w-96 rounded-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all border border-transparent focus-within:border-indigo-200">
                    <Search className="w-4 h-4 mr-3" />
                    <input
                        type="text"
                        placeholder="Search students, appointments..."
                        className="bg-transparent border-none outline-none w-full text-slate-700 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 text-slate-500">
                <button className="relative p-2 hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                        3
                    </span>
                </button>

                <button className="p-2 hover:text-indigo-600 transition-colors">
                    <LogOut className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold tracking-wide shadow-sm">
                        JS
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">John Student</p>
                        <p className="text-xs text-slate-500 font-medium">Computer Science</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;