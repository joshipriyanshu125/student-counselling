import React from "react";
import { Star, Clock, CheckCircle2 } from "lucide-react";

const CounsellorCard = ({ counsellor, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(counsellor)}
            className={`group relative bg-white rounded-3xl p-5 cursor-pointer transition-all duration-300 border-2 overflow-hidden ${isSelected
                    ? 'border-indigo-500 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50'
                    : 'border-transparent shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1'
                }`}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4 text-indigo-500 bg-indigo-50 rounded-full p-1 animate-in zoom-in">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}

            <div className="flex flex-col items-center text-center">
                {/* Avatar with decorative ring */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    {counsellor.profilePic ? (
                        <img
                            src={counsellor.profilePic.startsWith('http') ? counsellor.profilePic : `${import.meta.env.VITE_API_URL}${counsellor.profilePic}`}
                            alt={counsellor.fullName || counsellor.name}
                            className={`relative w-24 h-24 rounded-full object-cover border-4 transition-colors duration-300 ${isSelected ? 'border-indigo-50' : 'border-white'}`}
                        />
                    ) : (
                        <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-bold bg-indigo-50 text-indigo-600 ${isSelected ? 'border-indigo-50' : 'border-white'}`}>
                            {(counsellor.fullName || counsellor.name || "C").charAt(0)}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 w-full">
                    <div className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg mb-1">
                        {counsellor.specialization}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800">
                        {counsellor.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{counsellor.rating}</span>
                        <span className="text-slate-400 font-normal">({counsellor.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{counsellor.experience} Experience</span>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(counsellor);
                    }}
                    className={`mt-6 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                >
                    {isSelected ? 'Selected' : 'Book Session'}
                </button>
            </div>
        </div>
    );
};

export default CounsellorCard;