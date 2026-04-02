import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, FileText, Lightbulb, Star, User } from "lucide-react";
import API from "../api/api";

const SessionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const role = localStorage.getItem("role");
    const isCounsellor = role === "counsellor";

    const titleName = useMemo(() => {
        if (!session) return "";
        return isCounsellor
            ? session.student?.fullName || "Student"
            : session.counsellor?.fullName || "Counsellor";
    }, [session, isCounsellor]);

    useEffect(() => {
        let active = true;

        const fetchSession = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/sessions/${id}`);
                if (!active) return;

                if (res.data?.success) {
                    setSession(res.data.data);
                } else {
                    toast.error(res.data?.message || "Failed to load session details");
                }
            } catch (error) {
                const status = error.response?.status;
                const data = error.response?.data;
                const backendMessage =
                    typeof data === "string" ? data : data?.message || data?.error;
                const message =
                    backendMessage ||
                    error.message ||
                    "Failed to load session details";

                toast.error(status ? `${status}: ${message}` : message);
            } finally {
                if (active) setLoading(false);
            }
        };

        const fetchFeedback = async () => {
            try {
                setFeedbackLoading(true);
                const res = await API.get(`/feedback/session/${id}`);
                if (!active) return;

                if (res.data?.success) {
                    setFeedback(res.data.data || null);
                } else {
                    setFeedback(null);
                }
            } catch {
                setFeedback(null);
            } finally {
                if (active) setFeedbackLoading(false);
            }
        };

        if (!id) {
            toast.error("Missing session id");
            navigate("/sessions");
            return () => {};
        }

        fetchSession();
        fetchFeedback();
        return () => {
            active = false;
        };
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            Session Details
                        </h1>
                        <p className="text-slate-500 font-medium">No data found for this session.</p>
                    </div>
                </div>
            </div>
        );
    }

    const created = session.createdAt ? new Date(session.createdAt) : null;
    const followUp = session.followUpDate ? new Date(session.followUpDate) : null;

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Session Details
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {isCounsellor ? "Conducted session for" : "Session with"}{" "}
                        <span className="text-indigo-600 font-semibold">{titleName}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">
                                {isCounsellor ? "Student" : "Counsellor"}
                            </p>
                            <p className="text-slate-800 font-bold">{titleName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span>{created ? created.toLocaleDateString() : "Unknown date"}</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Session Notes
                        </label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 whitespace-pre-wrap">
                            {session.notes || "No notes provided."}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-slate-400" />
                            Recommendations
                        </label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 whitespace-pre-wrap">
                            {session.recommendations || "No recommendations provided."}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-500">Next Follow-up:</span>
                        <span className="text-slate-800 font-semibold">
                            {followUp ? followUp.toLocaleDateString() : "Not scheduled"}
                        </span>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                            Feedback
                        </h3>
                        {!isCounsellor && (
                            <button
                                onClick={() => navigate("/feedback", { state: { sessionId: id } })}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition"
                            >
                                Leave Feedback
                            </button>
                        )}
                    </div>

                    {feedbackLoading ? (
                        <div className="text-slate-500 font-medium">Loading feedback...</div>
                    ) : !feedback ? (
                        <div className="text-slate-500 font-medium">
                            No feedback submitted yet.
                        </div>
                    ) : (
                        <div
                            key={feedback._id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-slate-800 font-bold">
                                    {feedback.student?.fullName || feedback.student?.email || "Student"}
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                                    <Star className="w-4 h-4" />
                                    <span>{feedback.rating}</span>
                                </div>
                            </div>
                            {feedback.comment ? (
                                <div className="mt-2 text-slate-700 whitespace-pre-wrap">
                                    {feedback.comment}
                                </div>
                            ) : (
                                <div className="mt-2 text-slate-500">No comment.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
