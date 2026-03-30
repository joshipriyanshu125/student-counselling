import React, { useState } from "react";
import { Save, Calendar, FileText, Lightbulb } from "lucide-react";

const SessionForm = ({ appointment, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        notes: "",
        recommendations: "",
        followUpDate: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Session Details</h2>
                        <p className="text-slate-500 text-sm">
                            Conducting session for <span className="text-indigo-600 font-semibold">{appointment?.student?.fullName || "Student"}</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Session Notes */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Session Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Describe what was discussed during the session..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[150px]"
                            required
                        />
                    </div>

                    {/* Recommendations */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-slate-400" />
                            Recommendations
                        </label>
                        <textarea
                            name="recommendations"
                            value={formData.recommendations}
                            onChange={handleChange}
                            placeholder="What steps should the student take next?"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px]"
                        />
                    </div>

                    {/* Follow-up Date */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Next Follow-up (Optional)
                        </label>
                        <input
                            type="date"
                            name="followUpDate"
                            value={formData.followUpDate}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    {loading ? "Saving Session..." : "Save Session"}
                </button>
            </div>
        </form>
    );
};

export default SessionForm;