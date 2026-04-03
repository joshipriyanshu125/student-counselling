import React from "react";
import { Star, MapPin, Clock, Calendar, ChevronRight } from "lucide-react";

const CounsellorHighlightCard = ({ counsellor, onViewAvailability, onBook }) => {
    
    // Generate initials for avatar
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Random background color for avatar if not provided
    const avatarColors = [
        "bg-indigo-600",
        "bg-amber-500",
        "bg-emerald-500",
        "bg-rose-500",
        "bg-violet-500",
        "bg-cyan-500"
    ];
    
    const avatarColor = avatarColors[Math.abs(counsellor.fullName?.length || 0) % avatarColors.length];

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-100 group">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Avatar */}
                <div className="shrink-0">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] ${avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform duration-500`}>
                        {getInitials(counsellor.fullName || "C")}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {counsellor.fullName}
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                                    <Star className="w-5 h-5 fill-amber-500" />
                                    <span>{counsellor.rating || 5.0}</span>
                                    <span className="text-slate-400 font-medium text-sm">({counsellor.ratingCount || 0})</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                    <span>{counsellor.location || "Online / Campus"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags & Experience */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {counsellor.tags?.map((tag) => (
                            <span key={tag} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl border border-indigo-100/50">
                                {tag}
                            </span>
                        )) || (
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl border border-indigo-100/50">
                                {counsellor.specialization}
                            </span>
                        )}
                        <span className="px-4 py-1.5 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl border border-slate-100">
                            {counsellor.yearsOfExperience || 5}+ years
                        </span>
                    </div>

                    {/* Bio */}
                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                        {counsellor.bio || "No biography available."}
                    </p>

                    <div className="h-px bg-slate-100 w-full my-6"></div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            <Clock className="w-4 h-4" />
                            <span>Next: {counsellor.availability?.[0]?.day || "Soon"}, {counsellor.availability?.[0]?.slots?.[0] || "9:00 AM"}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => onViewAvailability(counsellor)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-200"
                            >
                                <Calendar className="w-4 h-4" />
                                Availability
                            </button>
                            <button 
                                onClick={() => onBook(counsellor)}
                                className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 animate-in slide-in-from-right-4 duration-500"
                            >
                                Book Now
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounsellorHighlightCard;
