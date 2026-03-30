import React from "react";

const AppointmentList = ({ appointments }) => {
    return (
        <div className="space-y-4">

            {appointments.map((appt, index) => (
                <div
                    key={index}
                    className="bg-white shadow-card p-4 rounded-lg"
                >

                    <h3 className="font-semibold">
                        {appt.counsellor}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {appt.date} • {appt.time}
                    </p>

                    <p className="text-sm mt-2">
                        {appt.notes}
                    </p>

                </div>
            ))}

        </div>
    );
};

export default AppointmentList;