import React from "react";

const StatusBadge = ({ status }) => {
    let colorClasses = "";

    if (status === "pending") {
        colorClasses = "bg-amber-50 text-amber-600 border-amber-200/60";
    } else if (status === "approved") {
        colorClasses = "bg-emerald-50 text-emerald-600 border-emerald-200/60";
    } else if (status === "rejected" || status === "cancelled") {
        colorClasses = "bg-rose-50 text-rose-600 border-rose-200/60";
    } else {
        colorClasses = "bg-slate-50 text-slate-600 border-slate-200/60";
    }

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${colorClasses}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;