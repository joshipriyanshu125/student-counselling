import React, { useState } from "react";

const SessionCard = ({ session }) => {

    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white shadow rounded-xl p-5">

            <div className="flex justify-between items-center">

                <div>
                    <h3 className="font-semibold text-lg">
                        {session.student}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {session.date} • {session.topic}
                    </p>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="text-indigo-600 text-sm"
                >
                    {open ? "Hide Notes" : "View Notes"}
                </button>

            </div>

            {open && (
                <div className="mt-4 text-sm text-gray-600 border-t pt-3">
                    {session.notes}
                </div>
            )}

        </div>
    );
};

export default SessionCard;