import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import API from "../api/api";
import { AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CallPage() {
    const { roomId, type } = useParams();
    const navigate = useNavigate();
    const meetingRef = useRef(null);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleExit = async () => {
        try {
            const role = localStorage.getItem("role");

            if (role === "counsellor" && appointment?._id) {
                await API.patch(`/appointments/${appointment._id}/end-meeting`);
                toast.success("Meeting ended");

                navigate("/create-session", {
                    state: { appointment },
                    replace: true
                });
            } else {
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error("Exit Error:", err);
            navigate("/dashboard", { replace: true });
        }
    };

    useEffect(() => {
        let zpInstance = null;

        const checkStatusAndInit = async () => {
            try {
                const res = await API.post(`/appointments/room/${roomId}/join`);
                const aptData = res.data.data;
                setAppointment(aptData);

                const meetingStart = new Date(`${aptData.date} ${aptData.time}`);
                const now = new Date();
                const meetingEnd = new Date(meetingStart.getTime() + 60 * 60 * 1000);

                // ❌ BLOCK CONDITIONS
                if (aptData.status === "completed") {
                    setError("This meeting has already been completed");
                    setLoading(false);
                    return;
                }

                // If not started by counsellor, check time window
                if (!aptData.isStarted) {
                    if (now < meetingStart) {
                        setError("Meeting has not started yet");
                        setLoading(false);
                        return;
                    }
                }

                if (now > meetingEnd) {
                    setError("Meeting has already ended");
                    setLoading(false);
                    return;
                }

                // ✅ INIT ZEGOCLOUD
                const appID = 1997477763;
                const serverSecret = "6c10a4d38865fa608dd6e13dc1ec43ff";

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    roomId,
                    Date.now().toString(),
                    "User"
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zpInstance = zp;

                zp.joinRoom({
                    container: meetingRef.current,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    turnOnCameraWhenJoining: type === "video",
                    turnOnMicrophoneWhenJoining: true,
                    showScreenSharingButton: type === "video",
                    onLeaveRoom: () => {
                        handleExit();
                    },
                });

                setLoading(false);

            } catch (err) {
                console.error("Call Error:", err);
                setError(err.response?.data?.message || "Failed to join call");
                setLoading(false);
            }
        };

        if (roomId) {
            checkStatusAndInit();
        }

        // ✅ CLEANUP (VERY IMPORTANT FIX)
        return () => {
            if (meetingRef.current) {
                meetingRef.current.innerHTML = "";
            }
        };

    }, [roomId, type]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-400 font-medium tracking-wide">Initializing call...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md w-full">

                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-amber-500" size={40} />
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                        Meeting Not Available
                    </h2>

                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/dashboard", { replace: true })}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                    >
                        <ArrowLeft size={18} />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={meetingRef}
            style={{ width: "100%", height: "100vh", background: "#000" }}
        />
    );
}