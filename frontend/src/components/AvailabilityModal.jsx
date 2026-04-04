import React from "react";
import { X, Calendar } from "lucide-react";
import { getDefaultWeeklyAvailability } from "../constants/bookingTimes";

const AvailabilityModal = ({ isOpen, onClose, counsellor }) => {
    if (!isOpen || !counsellor) return null;

    // Same slots as Book Appointment (dropdown), listed for each day (weekly grid ref.)
    const availability = getDefaultWeeklyAvailability();

    // 12h → 24h labels for pills (e.g. third reference: 10:00, 11:30, 14:00)
    const formatTime = (timeStr) => {
        const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!m) return timeStr;
        let h = parseInt(m[1], 10);
        const min = m[2];
        const ap = m[3].toUpperCase();
        if (ap === "PM" && h !== 12) h += 12;
        if (ap === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${min}`;
    };

    const getBorderColor = (spec) => {
        switch (spec) {
            case "Academic Guidance": return "border-t-indigo-500";
            case "Career": return "border-t-amber-500";
            case "Personal": return "border-t-rose-500";
            case "Mental Wellness": return "border-t-emerald-500";
            default: return "border-t-indigo-500";
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 border-t-4 ${getBorderColor(counsellor.specialization)}`}>
                
                {/* Header */}
                <div className="p-6 pb-2 flex items-center justify-between">
                    <h2 className="text-[1.4rem] font-bold text-[#1e293b] tracking-tight">
                        {counsellor.fullName}'s Availability
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-6 pt-2">
                    {/* Date Picker Mockup */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value="Pick a date"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-400 font-medium focus:outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[1.1rem] font-semibold text-[#1e293b]">Weekly Schedule</h3>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {availability.map((item) => (
                                <div key={item.day} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <span className="w-24 text-[1rem] font-medium text-slate-700">{item.day}</span>
                                        <div className="flex flex-wrap gap-2 flex-1">
                                            {item.slots.map((slot, idx) => (
                                                <div 
                                                    key={idx}
                                                    className="px-4 py-1.5 bg-[#06b6d4] text-white text-[0.9rem] font-bold rounded-full shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    {formatTime(slot)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simple Footer */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityModal;
