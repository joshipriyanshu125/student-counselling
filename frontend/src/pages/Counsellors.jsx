import React, { useState, useEffect } from "react";
import { Search, Filter, Users, Calendar, ArrowRight, Loader2 } from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CounsellorHighlightCard from "../components/CounsellorHighlightCard";
import AvailabilityModal from "../components/AvailabilityModal";

const Counsellors = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("All");
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    
    const navigate = useNavigate();

    const specializations = ["All", "Academic Guidance", "Career", "Personal", "Mental Wellness"];

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const res = await API.get("/counsellors");
                if (res.data && res.data.data) {
                    setCounsellors(res.data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load counsellors");
            } finally {
                setLoading(false);
            }
        };

        fetchCounsellors();
    }, []);

    const filteredCounsellors = counsellors.filter(c => {
        const matchesSearch = c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             c.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpec = selectedSpecialization === "All" || c.specialization === selectedSpecialization;
        return matchesSearch && matchesSpec;
    });

    const handleViewAvailability = (counsellor) => {
        setSelectedCounsellor(counsellor);
        setIsAvailabilityOpen(true);
    };

    const handleBookNow = (counsellor) => {
        // Navigate to book-appointment with the counsellor selected
        // We can pass the counsellor ID via state or search params
        navigate("/book-appointment", { state: { selectedCounsellorId: counsellor._id } });
    };

    return (
        <div className="pb-20">
            {/* Header Section */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Directory</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
                    Find the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Guidance</span>
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-2xl">
                    Connect with our professional counsellors specialized in various fields to help you navigate your academic and personal journey.
                </p>
            </div>

            {/* Filters & Search */}
            <div className="mb-10 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or expertise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm font-medium text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    
                    {/* Desktop Specialization Filters */}
                    <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                        {specializations.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialization(spec)}
                                className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                                    selectedSpecialization === spec
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100 scale-105"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Specialization Filters */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {specializations.map(spec => (
                        <button
                            key={spec}
                            onClick={() => setSelectedSpecialization(spec)}
                            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                                selectedSpecialization === spec
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                    : "bg-white text-slate-500 border border-slate-200"
                            }`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 font-bold">Discovering counsellors...</p>
                </div>
            ) : filteredCounsellors.length > 0 ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {filteredCounsellors.map(counsellor => (
                        <CounsellorHighlightCard 
                            key={counsellor._id} 
                            counsellor={counsellor}
                            onViewAvailability={handleViewAvailability}
                            onBook={handleBookNow}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-24 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Users className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">No counsellors found</h3>
                    <p className="text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
                </div>
            )}

            {/* Availability Modal */}
            <AvailabilityModal 
                isOpen={isAvailabilityOpen} 
                onClose={() => setIsAvailabilityOpen(false)}
                counsellor={selectedCounsellor}
            />
        </div>
    );
};

export default Counsellors;
