import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    HeartPulse, 
    TrendingUp, 
    Calendar, 
    MessageCircle, 
    ChevronRight,
    Sparkles,
    AlertCircle
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import API from "../api/api";
import toast from "react-hot-toast";

const MOODS = [
    { value: 1, label: "Awful", emoji: "😫", color: "bg-red-100 text-red-600 border-red-200" },
    { value: 2, label: "Low", emoji: "😟", color: "bg-orange-100 text-orange-600 border-orange-200" },
    { value: 3, label: "Okay", emoji: "😐", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
    { value: 4, label: "Good", emoji: "🙂", color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
    { value: 5, label: "Great", emoji: "😄", color: "bg-indigo-100 text-indigo-600 border-indigo-200" },
];

function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState("");
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoggedToday, setHasLoggedToday] = useState(false);

    useEffect(() => {
        fetchMoodData();
    }, []);

    const fetchMoodData = async () => {
        try {
            setIsLoading(true);
            const [statsRes, todayRes] = await Promise.all([
                API.get("/moods/stats"),
                API.get("/moods/today")
            ]);

            if (statsRes.data?.success) {
                const chartData = statsRes.data.data.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    mood: item.mood,
                    rawDate: item.date
                }));
                setHistory(chartData);
                setStats({
                    average: statsRes.data.average,
                    count: statsRes.data.data.length
                });
            }

            if (todayRes.data?.success && todayRes.data.data) {
                setSelectedMood(todayRes.data.data.mood);
                setNote(todayRes.data.data.note || "");
                setHasLoggedToday(true);
            }
        } catch (error) {
            console.error("Failed to fetch mood data", error);
            toast.error("Could not load mood history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogMood = async () => {
        if (!selectedMood) {
            toast.error("Please select a mood first");
            return;
        }

        try {
            const res = await API.post("/moods", { mood: selectedMood, note });
            if (res.data?.success) {
                toast.success(hasLoggedToday ? "Mood updated!" : "Mood logged for today!");
                setHasLoggedToday(true);
                fetchMoodData();
            }
        } catch (error) {
            toast.error("Failed to save mood");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                    <HeartPulse size={28} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Mood Tracker</h1>
                    <p className="text-slate-500 font-bold mt-1">Check in with yourself daily and reflect on how your mood evolves over time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daily Check-in Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-10 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3 text-slate-800">
                                <Sparkles className="text-indigo-500" size={24} />
                                <h2 className="text-2xl font-black tracking-tight">Daily Mood Check-in</h2>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">7-day avg</span>
                                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-black text-indigo-600 text-xl">
                                    {stats.average}
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-500 font-bold mb-8">
                            {hasLoggedToday 
                                ? "You've logged your mood today — feel free to update it." 
                                : "How are you feeling right now? Your daily reflection helps you understand your mental well-being."
                            }
                        </p>

                        {/* Mood Selector */}
                        <div className="grid grid-cols-5 gap-3 sm:gap-4 mb-8">
                            {MOODS.map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => setSelectedMood(m.value)}
                                    className={`flex flex-col items-center gap-3 p-4 sm:p-6 rounded-3xl transition-all duration-300 border-2 ${
                                        selectedMood === m.value 
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105" 
                                            : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-white"
                                    }`}
                                >
                                    <span className="text-3xl sm:text-4xl">{m.emoji}</span>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedMood === m.value ? "text-indigo-100" : "text-slate-400"}`}>
                                        {m.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Note field */}
                        <div className="space-y-3 mb-8">
                            <label className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] px-1">
                                <MessageCircle size={14} />
                                Add a quick note about your day (optional)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What's contributing to your mood today?"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all resize-none h-32"
                            />
                        </div>

                        <button
                            onClick={handleLogMood}
                            disabled={!selectedMood}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black px-10 py-5 rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            <Sparkles size={18} />
                            {hasLoggedToday ? "Update today's mood" : "Save today's mood"}
                        </button>
                    </div>

                    {/* Chart Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-10 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-emerald-500" size={24} />
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Last 7 days</h2>
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {stats.count} {stats.count === 1 ? 'entry' : 'entries'} total
                            </span>
                        </div>

                        <div className="h-[300px] w-full">
                            {history.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            domain={[1, 5]} 
                                            ticks={[1, 2, 3, 4, 5]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                borderRadius: '20px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                padding: '12px 16px'
                                            }}
                                            itemStyle={{ fontWeight: '800', color: '#4f46e5' }}
                                            labelStyle={{ fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="mood" 
                                            stroke="#6366f1" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorMood)" 
                                            dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 8, fill: '#4338ca', strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                    <Calendar size={48} className="opacity-20" />
                                    <p className="font-black uppercase tracking-widest text-xs">No mood data recorded yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <HeartPulse size={120} />
                        </div>
                        <h3 className="text-xl font-black mb-4 relative z-10">Why track your mood?</h3>
                        <p className="text-indigo-100 font-bold text-sm leading-relaxed mb-6 relative z-10">
                            Consistently logging how you feel helps identify patterns, triggers, and the effectiveness of your coping strategies.
                        </p>
                        <div className="space-y-4 relative z-10">
                            {[
                                "Spot emotional trends",
                                "Identify stress triggers",
                                "Better self-awareness",
                                "Inform therapy sessions"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                                    <ChevronRight size={16} className="text-indigo-300" />
                                    <span className="text-xs font-black uppercase tracking-wider">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-orange-500" size={20} />
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Need Support?</h3>
                        </div>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">
                            If you're feeling consistently low or overwhelmed, don't hesitate to reach out to our professional counsellors.
                        </p>
                        <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl border border-slate-100 transition-all uppercase tracking-widest text-[10px]">
                            Book a session
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MoodTracker;
