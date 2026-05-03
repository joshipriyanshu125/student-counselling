import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCalendarAlt, FaComments, FaFileAlt, FaExclamationTriangle, FaBell, FaSave } from "react-icons/fa"
import Button from "../components/Button"
import InputField from "../components/InputField"
import Toggle from "../components/Toggle"
import API from "../api/api"
import toast from "react-hot-toast"

function Profile() {

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        studentId: "",
        program: "",
        role: "",
        profilePic: "",
        notificationPreferences: {
            appointmentReminders: { email: true, push: true },
            newMessages: { email: true, push: true },
            sessionNotes: { email: true, push: false },
            systemAlerts: { email: true, push: true },
            feedbackRequests: { email: false, push: true }
        }
    })

    const [editMode, setEditMode] = useState(false)

    /* Fetch profile from backend */

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await API.get("/users/me")

                if (res?.data) {
                    setProfile({
                        fullName: res.data.fullName || "",
                        email: res.data.email || "",
                        phone: res.data.phone || "",
                        studentId: res.data.studentId || "",
                        program: res.data.program || "",
                        role: res.data.role || "student",
                        profilePic: res.data.profilePic || "",
                        notificationPreferences: res.data.notificationPreferences || {
                            appointmentReminders: { email: true, push: true },
                            newMessages: { email: true, push: true },
                            sessionNotes: { email: true, push: false },
                            systemAlerts: { email: true, push: true },
                            feedbackRequests: { email: false, push: true }
                        }
                    })
                }

            } catch (error) {

                toast.error("Failed to load profile")

            }

        }

        fetchProfile()

    }, [])


    const handleChange = (field, value) => {

        setProfile({
            ...profile,
            [field]: value
        })

    }


    const handleSave = async () => {

        try {

            const res = await API.put("/users/profile", profile)

            if (res?.data) {
                setProfile(res.data)
            }

            toast.success("Profile updated successfully")

            setEditMode(false)

        } catch (error) {

            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to update profile"

            toast.error(msg)

        }

    }


    const handleUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await API.post("/users/upload-profile", formData);

            // update UI instantly
            setProfile((prev) => ({
                ...prev,
                profilePic: res.data.image,
            }));

            // optional cache
            localStorage.setItem("profilePic", res.data.image);
            toast.success("Profile picture updated!");

        } catch (err) {
            console.error("Upload failed details:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Upload failed");
        }
    };


    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto space-y-8"
        >

            {/* Profile Card */}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-center relative">

                <div className="h-40 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 w-full relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative -mt-20 w-40 h-40 mx-auto rounded-full border-8 border-white bg-slate-50 overflow-hidden shadow-xl flex items-center justify-center text-indigo-100 z-10 group/avatar">
                    <img
                        src={
                            profile.profilePic
                                ? (profile.profilePic.startsWith('http') ? profile.profilePic : `${import.meta.env.VITE_API_URL}${profile.profilePic}`)
                                : (localStorage.getItem("profilePic") 
                                    ? (localStorage.getItem("profilePic").startsWith('http') ? localStorage.getItem("profilePic") : `${import.meta.env.VITE_API_URL}${localStorage.getItem("profilePic")}`)
                                    : "/default-avatar.png")
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                        <label htmlFor="profile-upload" className="cursor-pointer text-white text-xs font-bold uppercase tracking-wider">
                            Change
                        </label>
                    </div>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files[0])}
                    />
                </div>

                <div className="py-8 px-4 relative z-10">

                    <h2 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">
                        {profile.fullName || "User"}
                    </h2>

                    <p className="text-indigo-600 font-semibold flex items-center justify-center gap-2 mt-2 capitalize">
                        <FaMapMarkerAlt className="text-indigo-400" />
                        {profile.role === "student" && profile.program 
                            ? `Student • ${profile.program}` 
                            : profile.role || "Student"}
                    </p>

                </div>

            </div>


            {/* Personal Information */}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-10">

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">

                    <h3 className="text-2xl font-heading font-bold text-slate-800 tracking-tight">
                        Personal Information
                    </h3>

                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors text-sm"
                    >
                        {editMode ? "Cancel" : "Edit Mode"}
                    </button>

                </div>


                {/* Form Fields */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <InputField
                        label="Full Name"
                        value={profile.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        icon={FaUserCircle}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        icon={FaEnvelope}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Phone Number"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        icon={FaPhone}
                        disabled={!editMode}
                    />

                    <InputField
                        label={profile.role === "counsellor" ? "Counsellor ID" : "Student ID"}
                        value={profile.studentId}
                        onChange={(e) => handleChange("studentId", e.target.value)}
                        icon={FaIdCard}
                        disabled={!editMode}
                    />

                </div>


                {/* Buttons */}

                {editMode && (

                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-4">

                        <Button
                            variant="secondary"
                            text="Cancel Changes"
                            className="w-full sm:w-auto px-8"
                            onClick={() => setEditMode(false)}
                        />

                        <Button
                            text="Save Profile"
                            className="w-full sm:w-auto px-10 shadow-lg shadow-indigo-500/20"
                            onClick={handleSave}
                        />

                    </div>

                )}

            </div>


            {/* Notification Preferences Section */}

            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 border border-slate-100 group hover:shadow-xl transition-all duration-500">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">

                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                            <FaEnvelope className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                Notification Preferences
                            </h3>
                            <p className="text-slate-400 font-bold text-sm tracking-wider uppercase mt-1">Manage your alerts</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <FaSave />
                        Save Preferences
                    </button>

                </div>


                <div className="space-y-2">

                    {/* Column Labels */}
                    <div className="grid grid-cols-12 mb-6 px-6">
                        <div className="col-span-8"></div>
                        <div className="col-span-2 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest">Email</div>
                        <div className="col-span-2 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest">Push</div>
                    </div>


                    {/* Preference Rows */}

                    {[
                        { 
                            id: "appointmentReminders", 
                            label: "Appointment Reminders", 
                            desc: "Get notified before upcoming appointments", 
                            icon: FaCalendarAlt,
                            color: "bg-indigo-50 text-indigo-600" 
                        },
                        { 
                            id: "newMessages", 
                            label: "New Messages", 
                            desc: "When a counsellor sends you a message", 
                            icon: FaComments,
                            color: "bg-blue-50 text-blue-600" 
                        },
                        { 
                            id: "sessionNotes", 
                            label: "Session Notes", 
                            desc: "When session notes are shared with you", 
                            icon: FaFileAlt,
                            color: "bg-violet-50 text-violet-600" 
                        },
                        { 
                            id: "systemAlerts", 
                            label: "System Alerts", 
                            desc: "Important system updates and announcements", 
                            icon: FaExclamationTriangle,
                            color: "bg-rose-50 text-rose-600" 
                        },
                        { 
                            id: "feedbackRequests", 
                            label: "Feedback Requests", 
                            desc: "Reminders to submit session feedback", 
                            icon: FaBell,
                            color: "bg-amber-50 text-amber-600" 
                        }
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className="grid grid-cols-12 items-center py-6 px-6 hover:bg-slate-50 rounded-[2rem] transition-all duration-300 border-b border-slate-50 last:border-0"
                        >
                            <div className="col-span-8 flex items-center gap-5">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${item.color} shadow-sm`}>
                                    <item.icon className="text-xl" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-extrabold text-slate-800 text-lg leading-tight">{item.label}</p>
                                    <p className="text-sm text-slate-400 font-bold mt-1 truncate">{item.desc}</p>
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-center">
                                <Toggle 
                                    enabled={profile.notificationPreferences?.[item.id]?.email}
                                    onChange={(val) => {
                                        setProfile({
                                            ...profile,
                                            notificationPreferences: {
                                                ...profile.notificationPreferences,
                                                [item.id]: {
                                                    ...profile.notificationPreferences?.[item.id],
                                                    email: val
                                                }
                                            }
                                        })
                                    }}
                                />
                            </div>

                            <div className="col-span-2 flex justify-center">
                                <Toggle 
                                    enabled={profile.notificationPreferences?.[item.id]?.push}
                                    onChange={(val) => {
                                        setProfile({
                                            ...profile,
                                            notificationPreferences: {
                                                ...profile.notificationPreferences,
                                                [item.id]: {
                                                    ...profile.notificationPreferences?.[item.id],
                                                    push: val
                                                }
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </motion.div>
    )
}

export default Profile;