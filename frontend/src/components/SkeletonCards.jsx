import React from "react";

export const DashboardStatSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
        <div className="h-10 bg-slate-200 rounded w-full mb-4"></div>
        <div className="h-3 bg-slate-100 rounded w-16"></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-50 rounded-2xl"></div>
    </div>
);

export const AppointmentCardSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-24"></div>
                </div>
            </div>
            <div className="h-6 bg-slate-100 rounded-full w-20"></div>
        </div>
        <div className="pt-4 border-t border-slate-50 flex gap-6 pl-16">
            <div className="h-3 bg-slate-100 rounded w-20"></div>
            <div className="h-3 bg-slate-100 rounded w-20"></div>
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
        <div className="h-[250px] bg-slate-50 rounded w-full"></div>
    </div>
);
