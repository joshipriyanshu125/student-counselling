
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";

const BookAppointment = () => {

    const [counsellors, setCounsellors] = useState([]);
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("");
    const [message, setMessage] = useState("");

    // Fetch counsellors from backend
    useEffect(() => {

        const fetchCounsellors = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await API.get("/counsellors", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data && res.data.data) {
                    setCounsellors(res.data.data);
                }

            } catch (error) {

                console.error(error);
                toast.error("Failed to load counsellors");

            }

        };

        fetchCounsellors();

    }, []);

    const handleSubmit = async () => {

        if (!selectedCounsellor || !date || !time || !mode) {
            toast.error("Please fill all required fields");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const payload = {
                counsellorId: selectedCounsellor._id,
                date,
                time,
                mode,
                message
            };

            await API.post(
                "/appointments",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Appointment booked successfully");

            setSelectedCounsellor(null);
            setDate("");
            setTime("");
            setMode("");
            setMessage("");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message || "Failed to book appointment"
            );

        }

    };

    const SimpleCounsellorCard = ({ counsellor, isSelected, onSelect }) => (

        <div
            onClick={() => onSelect(counsellor)}
            className={`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${isSelected
                ? "border-[#0ea5e9] bg-[#f0f9ff] ring-1 ring-[#0ea5e9]"
                : "border-slate-200 bg-white hover:border-slate-300"
                }`}
        >

            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600">
                👨‍⚕️
            </div>

            <div>

                <h4 className="text-base font-bold text-slate-800">
                    {counsellor.fullName || counsellor.name}
                </h4>

                <div className="flex items-center text-sm text-slate-500 mt-1">
                    {counsellor.specialization || "General Counselling"}
                    <span className="mx-2">•</span>
                    ⭐ {counsellor.rating || 5}
                </div>

            </div>

        </div>

    );

    return (

        <div className="pb-20">

            <div className="mb-8">

                <h1 className="text-3xl font-extrabold text-slate-800">
                    Book Appointment
                </h1>

                <p className="mt-2 text-slate-500">
                    Schedule a session with your preferred counsellor
                </p>

            </div>

            <div className="max-w-4xl">

                <h3 className="text-base font-semibold text-slate-800 mb-4">
                    Select Counsellor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                    {counsellors.map((counsellor) => (

                        <SimpleCounsellorCard
                            key={counsellor._id}
                            counsellor={counsellor}
                            isSelected={selectedCounsellor?._id === counsellor._id}
                            onSelect={setSelectedCounsellor}
                        />

                    ))}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <input
                        type="date"
                        className="border border-slate-200 rounded-xl p-3"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <select
                        className="border border-slate-200 rounded-xl p-3"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        <option value="">Select Time</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                    </select>

                </div>

                <select
                    className="border border-slate-200 rounded-xl p-3 mb-6 w-full"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="">Select Mode</option>
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Call</option>
                    <option value="in_person">In Person</option>
                </select>

                <textarea
                    className="border border-slate-200 rounded-xl p-3 w-full mb-8"
                    placeholder="Additional Notes"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium py-3 px-6 rounded-xl"
                >
                    Book Appointment
                </button>

            </div>

        </div>

    );

};

export default BookAppointment;
