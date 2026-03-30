import React, { useState } from "react";
import { X, Star } from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose, sessionId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            await API.post("/feedback", {
                sessionId,
                rating,
                comment
            });

            toast.success("Feedback submitted successfully");
            setRating(0);
            setComment("");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            const data = error.response?.data;
            const message = data?.message || data?.error || error.message || "Failed to submit feedback";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Provide Feedback</h2>
                        <p className="text-slate-500 text-sm mt-0.5 font-medium">How was your session experience?</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-4xl transition-all hover:scale-110 active:scale-95 ${
                                        rating >= star ? "text-amber-400" : "text-slate-200"
                                    }`}
                                >
                                    <Star className={`w-10 h-10 ${rating >= star ? "fill-amber-400" : "fill-none"}`} />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-600">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                        </p>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            Additional Comments <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none h-32 font-medium text-slate-700"
                            placeholder="Tell us what you liked or what we can improve..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
