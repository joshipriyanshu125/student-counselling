import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Users, 
    CheckCircle, 
    XCircle, 
    User, 
    Mail, 
    Briefcase, 
    ShieldCheck,
    Clock,
    Search
} from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCounsellors = async () => {
        try {
            setIsLoading(true);
            const res = await API.get("/admin/pending-counsellors");
            
            // Explicitly check for success and data being an array
            if (res.data?.success && Array.isArray(res.data.data)) {
                setCounsellors(res.data.data);
            } else {
                // If the response is successful but data is missing, just set empty array
                setCounsellors([]);
            }
        } catch (error) {
            console.error("Failed to load pending counsellors", error);
            const errorMsg = error.response?.data?.message || "Failed to load pending requests";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await API.put(`/admin/approve/${id}`);
            if (res.data?.success) {
                toast.success("Counsellor approved successfully");
                setCounsellors(prev => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this registration? This will delete the user account.")) return;
        
        try {
            const res = await API.delete(`/admin/reject/${id}`);
            if (res.data?.success) {
                toast.success("Registration rejected and removed");
                setCounsellors(prev => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    useEffect(() => {
        fetchCounsellors();
    }, []);

    const filteredCounsellors = counsellors.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            className="max-w-6xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                        <ShieldCheck className="text-indigo-600" size={40} />
                        Admin Panel
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Review and manage counsellor registration requests.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-100 py-3.5 pl-12 pr-6 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all min-w-[300px] font-bold text-slate-700"
                    />
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
                    <p className="text-indigo-100 font-black uppercase tracking-widest text-[10px] mb-2">Pending Requests</p>
                    <h2 className="text-5xl font-black">{counsellors.length}</h2>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm md:col-span-2 flex items-center gap-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Quality Assurance</h3>
                        <p className="text-slate-500 font-bold text-sm">Please verify counsellor credentials and specialization before approving them for the platform.</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 px-2">
                    <Clock className="text-indigo-500" size={24} />
                    Review Pipeline
                </h2>

                {filteredCounsellors.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                        <Users className="mx-auto text-slate-200 mb-6" size={64} />
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No pending requests found</h3>
                        <p className="text-slate-400 font-bold mt-2">Check back later for new registration applications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredCounsellors.map((c) => (
                            <motion.div
                                key={c._id}
                                layout
                                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl hover:border-indigo-100 transition-all duration-500"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                                        {c.profilePic ? (
                                            <img src={c.profilePic} alt={c.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-slate-300" size={32} />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-800 leading-tight">{c.fullName}</h3>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                <Mail size={16} className="text-indigo-400" />
                                                {c.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                <Briefcase size={16} className="text-indigo-400" />
                                                {c.specialization || "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleReject(c._id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black px-8 py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(c._id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                                    >
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;