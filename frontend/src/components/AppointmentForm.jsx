import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, X, Check, Info } from "lucide-react";

const AppointmentForm = ({ counsellor, onClose }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const timeSlots = [
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "02:00 PM",
        "04:00 PM"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            console.log("Appointment booked:", { counsellor: counsellor.name, date, time });

            // Auto close after success
            setTimeout(() => {
                if (onClose) onClose();
                setIsSuccess(false);
                setDate("");
                setTime("");
            }, 3000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h3>
                <p className="text-slate-500 mb-6">
                    Your session with <span className="font-semibold text-slate-700">{counsellor.name}</span> is scheduled for <span className="font-semibold text-slate-700">{date} at {time}</span>.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden relative">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-5 flex items-center justify-between">
                <div>
                    <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-1">Schedule Session</p>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {counsellor.name}
                    </h2>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                {/* Date Selection */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        Select Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm outline-none"
                            value={date}
                            min={new Date().toISOString().split('T')[0]} /* Prevent past dates */
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Time Selection */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        Available Slots
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map((slot, index) => (
                            <div
                                key={index}
                                onClick={() => setTime(slot)}
                                className={`border rounded-xl p-3 text-center cursor-pointer transition-all duration-200 text-sm font-medium ${time === slot
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                                    }`}
                            >
                                {slot}
                            </div>
                        ))}
                    </div>

                    {/* Hidden input to ensure required validation works natively */}
                    <input type="hidden" value={time} required />
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Sessions are typically 45 minutes long. You will receive a meeting link in your email once confirmed.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !date || !time}
                    className={`w-full relative group overflow-hidden rounded-xl py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 outline-none flex justify-center items-center gap-2 ${isSubmitting || !date || !time
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-indigo-500/30'
                        }`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        <>
                            Confirm Appointment
                            <Check className="w-4 h-4 ml-1 opacity-80" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;