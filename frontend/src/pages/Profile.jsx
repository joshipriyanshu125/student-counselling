import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard } from "react-icons/fa"
import Button from "../components/Button"
import InputField from "../components/InputField"
import API from "../api/api"
import toast from "react-hot-toast"

function Profile() {

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        studentId: "",
        program: "",
        role: ""
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
                        role: res.data.role || "student"
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

                <div className="relative -mt-20 w-40 h-40 mx-auto rounded-full border-8 border-white bg-slate-50 overflow-hidden shadow-xl flex items-center justify-center text-indigo-100 z-10">
                    <FaUserCircle className="text-[10rem] text-slate-300 mt-6" />
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

        </motion.div>
    )
}

export default Profile;