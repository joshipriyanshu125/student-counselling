import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import { MessageSquare, Star, X } from "lucide-react";
import FeedbackModal from "../components/FeedbackModal";

function Sessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const role = localStorage.getItem("role");
    const isCounsellor = role === "counsellor";

    // Modal state
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchSessions = async () => {
            try {
                const endpoint = isCounsellor ? "/sessions/my" : "/sessions/student";
                const res = await API.get(endpoint);
                if (isMounted) {
                    setSessions(res.data.data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error("Failed to load sessions");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchSessions();
        return () => { isMounted = false; };
    }, [isCounsellor]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {isCounsellor ? "Sessions Conducted" : "Session History"}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {isCounsellor 
                            ? "Review and manage the counselling sessions you've hosted."
                            : "Review your past counseling sessions and counselor notes."}
                    </p>
                </div>

                {isCounsellor && (
                    <button
                        onClick={() => navigate("/create-session")}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm"
                    >
                        Create New Session
                    </button>
                )}
            </div>

            {/* Sessions List */}
            <div className="grid gap-4 mt-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <div
                            key={session._id || index}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                        >
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {index + 1}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h3 className="font-bold text-lg text-slate-800">
                                        {session.appointment?.mode || "General Session"}
                                    </h3>
                                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 uppercase tracking-wider">
                                        {session.appointment?.mode || "Standard"}
                                    </span>
                                </div>

                                <div className="text-slate-500 text-sm font-medium flex flex-wrap gap-x-4 gap-y-1">
                                    <span className="flex items-center gap-1">
                                        <span className="text-slate-400 capitalize">{isCounsellor ? "Student" : "Counsellor"}:</span>
                                        <span className="text-slate-700">
                                            {isCounsellor 
                                                ? (session.student?.fullName || "Student") 
                                                : (session.counsellor?.fullName || "Counsellor")}
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-slate-400">Date:</span>
                                        <span className="text-slate-700">{new Date(session.createdAt).toLocaleDateString()}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="w-full sm:w-auto flex gap-2">
                                <button
                                    onClick={() => navigate(`/sessions/${session._id}`)}
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                                >
                                    View Details
                                </button>
                                {!isCounsellor && (
                                    <button
                                        onClick={() => {
                                            setSelectedSessionId(session._id);
                                            setIsFeedbackModalOpen(true);
                                        }}
                                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-md active:scale-95"
                                    >
                                        Feedback
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No sessions found</h3>
                        <p className="text-slate-500 mt-1">
                            {isCounsellor 
                                ? "You haven't conducted any sessions yet." 
                                : "Your session history will appear here once sessions are completed with a counsellor."}
                        </p>
                    </div>
                )}
            </div>

            {/* Feedback Popup Modal */}
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                sessionId={selectedSessionId}
            />
        </div>
    );
}

export default Sessions;