import React from "react";

const DashboardCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="bg-card text-card-foreground rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition border border-border">

            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>

            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h3 className="text-xl font-semibold">{value}</h3>
            </div>

        </div>
    );
};

export default DashboardCard;