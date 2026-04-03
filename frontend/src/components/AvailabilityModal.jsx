import React from "react";
import { X, Calendar } from "lucide-react";

const AvailabilityModal = ({ isOpen, onClose, counsellor }) => {
    if (!isOpen || !counsellor) return null;

    const availability = counsellor.availability || [];

    // Format time from "09:00 AM" to "09:00" for visual consistency with SS
    const formatTime = (timeStr) => {
        return timeStr.replace(" AM", "").replace(" PM", "");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#f8f9fc] rounded-[1.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                
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
