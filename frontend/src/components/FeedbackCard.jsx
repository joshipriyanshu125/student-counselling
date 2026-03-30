import { Star } from "lucide-react";

function FeedbackCard({ feedback }) {

    return (
        <div className="bg-white rounded-xl p-5 shadow border border-slate-100">

            <div className="flex justify-between mb-2">

                <h3 className="font-semibold text-slate-800">
                    {feedback.counsellor}
                </h3>

                <div className="flex">

                    {[...Array(feedback.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}

                </div>

            </div>

            <p className="text-slate-600 text-sm">
                {feedback.comment}
            </p>

        </div>
    );
}

export default FeedbackCard;