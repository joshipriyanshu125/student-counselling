import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import FormCard from "../components/FormCard"
import API from "../api/api"
import toast from "react-hot-toast"

function Feedback() {

    const location = useLocation()
    const navigate = useNavigate()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const sessionId = useMemo(() => location.state?.sessionId, [location.state])

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!sessionId) {
            toast.error("Missing session. Please open Feedback from a session.")
            return
        }

        if (!rating) {
            toast.error("Please select a rating")
            return
        }

        try {

            await API.post("/feedback", {
                sessionId,
                rating,
                comment
            })

            toast.success("Feedback submitted successfully")

            setRating(0)
            setComment("")
            navigate("/sessions")

        } catch (error) {

            const status = error.response?.status
            const data = error.response?.data
            const backendMessage =
                typeof data === "string" ? data : data?.message || data?.error
            const message =
                backendMessage ||
                error.message ||
                "Failed to submit feedback"

            toast.error(status ? `${status}: ${message}` : message)

        }

    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="text-center mb-10">

                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    Provide Feedback
                </h1>

                <p className="text-slate-500 mt-2 font-medium">
                    Your feedback helps us continuously improve our counseling services.
                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <FormCard
                    title="Session Experience"
                    subtitle={sessionId ? "Rate your session" : "Open this page from a session to leave feedback"}
                >

                    {/* Star Rating */}

                    <div className="flex justify-center gap-3 mb-10 group/rating">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-5xl transition-all hover:scale-110 active:scale-95
                                ${rating >= star ? "text-amber-400" : "text-slate-200"}`}
                            >
                                ★
                            </button>

                        ))}

                    </div>

                    {/* Comment Box */}

                    <div className="space-y-6">

                        <div>

                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                What went well?
                                <span className="text-slate-400 font-normal"> (Optional)</span>
                            </label>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none h-36 font-medium text-slate-700"
                                placeholder="Share your thoughts about the session..."
                            />

                        </div>

                        <Button
                            text="Submit Feedback"
                            className="py-3.5 text-lg shadow-xl shadow-indigo-500/20 mt-4"
                        />

                    </div>

                </FormCard>

            </form>

        </div>
    )
}

export default Feedback