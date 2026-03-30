import React, { useState } from "react";
import SessionForm from "../components/SessionForm";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const CreateSession = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appointment = location.state?.appointment;
    const [loading, setLoading] = useState(false);

    if (!appointment) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mx-auto max-w-2xl mt-12">
                <h2 className="text-xl font-bold text-slate-800 mb-4">No appointment selected</h2>
                <p className="text-slate-500 mb-8 px-8 text-center">To create a session, please select an approved appointment from your dashboard.</p>
                <button 
                    onClick={() => navigate("/counsellor-appointments")}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    const handleCreate = async (sessionData) => {
        try {
            setLoading(true);
            const payload = {
                appointmentId: appointment._id,
                ...sessionData,
                followUpDate:
                    sessionData.followUpDate && sessionData.followUpDate.trim() !== ""
                        ? sessionData.followUpDate
                        : null,
            };

            const res = await API.post("/sessions", payload);

            if (res.data?.success) {
                toast.success("Session recorded successfully!");
                navigate("/sessions");
            }
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;
            const backendMessage =
                typeof data === "string" ? data : data?.message || data?.error;
            const message =
                backendMessage ||
                error.message ||
                "Failed to save session";

            console.error("Session creation error:", {
                url: error.config?.baseURL
                    ? `${error.config.baseURL}${error.config.url || ""}`
                    : error.config?.url,
                status,
                data,
                message,
            });

            toast.error(status ? `${status}: ${message}` : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Complete Session
                    </h1>
                    <p className="text-slate-500 font-medium">Capture notes and recommendations for this session.</p>
                </div>
            </div>

            <SessionForm 
                appointment={appointment} 
                onSubmit={handleCreate} 
                loading={loading} 
            />
        </div>
    );
};

export default CreateSession;