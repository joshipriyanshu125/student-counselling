import React, { useState } from "react"
import { Calendar, Clock, User, CheckCircle, Video, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"
import toast from "react-hot-toast"
import { canJoinMeeting } from "../utils/canJoinMeeting" // ✅ ADDED

const AppointmentCard = ({ appointment, updateStatus }) => {
    const navigate = useNavigate();
    const [starting, setStarting] = useState(false);

    const handleStartMeeting = async () => {
        try {
            setStarting(true);
            await API.post(`/appointments/${appointment._id}/start-meeting`);
            toast.success("Student notified! Joining call...");
            navigate(`/call/${appointment.type}/${appointment.roomId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to start meeting");
        } finally {
            setStarting(false);
        }
    };

    return (

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">

            <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {appointment.student?.profilePic ? (
                            <img 
                                src={appointment.student.profilePic.startsWith('http') ? appointment.student.profilePic : `${import.meta.env.VITE_API_URL}${appointment.student.profilePic}`} 
                                alt={appointment.student.fullName} 
                                className="w-full h-full object-cover rounded-xl" 
                            />
                        ) : (
                            <User className="text-indigo-600" size={24} />
                        )}
                    </div>

                    <div>

                        <h3 className="font-bold text-slate-800">
                            {appointment.student?.fullName || appointment.student?.email?.split("@")?.[0] || "Unknown Student"}
                        </h3>

                        <p className="text-sm text-slate-400 font-medium">
                            {appointment.student?.email || "No email provided"}
                        </p>

                        <p className="text-[13px] text-slate-500 mt-1 italic">
                            "{appointment.reason}"
                        </p>

                    </div>

                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${appointment.status === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    appointment.status === "rejected" ? "bg-red-50 text-red-600 border border-red-100" :
                        appointment.status === "completed" ? "bg-slate-50 text-slate-500 border border-slate-200" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                    {appointment.status}
                </span>

            </div>

            <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-slate-50 text-slate-500 text-[13px] font-semibold pl-16">

                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(appointment.date).toDateString()}
                </div>

                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    {appointment.time}
                </div>

                {appointment.type && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                        appointment.type === "video"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : appointment.type === "audio"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-orange-50 text-orange-600 border border-orange-100"
                    }`}>
                        {appointment.type === "video" ? <Video size={12} /> : appointment.type === "audio" ? <Phone size={12} /> : null}
                        {appointment.type === "video" ? "Video Call" : appointment.type === "audio" ? "Audio Call" : "In-Person"}
                    </div>
                )}

            </div>

            <div className="flex flex-wrap gap-3 mt-5 pl-16">

                {/* 🔘 Approve / Reject */}
                {appointment.status === "pending" && (
                    <>
                        <button
                            onClick={() => updateStatus(appointment._id, "approved")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => updateStatus(appointment._id, "rejected")}
                            className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                            Reject
                        </button>
                    </>
                )}

                {/* 🔥 Start Meeting Button — counsellor can always start an approved meeting */}
                {appointment.status === "approved" &&
                    appointment.type !== "in-person" &&
                    appointment.roomId && (
                        <button
                            onClick={handleStartMeeting}
                            disabled={starting}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
                        >
                            {appointment.type === "video" ? <Video size={16} /> : <Phone size={16} />}
                            {starting ? "Starting…" : `Start ${appointment.type === "video" ? "Video" : "Audio"} Meeting`}
                        </button>
                    )
                }

                {/* ✅ Complete Session */}
                {appointment.status === "approved" && (
                    <button
                        onClick={() => navigate("/create-session", { state: { appointment } })}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md group"
                    >
                        <CheckCircle size={14} className="group-hover:scale-110 transition-transform" />
                        Complete Session
                    </button>
                )}

                {appointment.status === "completed" && (
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
                        <CheckCircle size={14} className="text-emerald-500" />
                        Session Completed
                    </div>
                )}

            </div>

        </div>

    )

}

export default AppointmentCard;