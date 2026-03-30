import React from "react";
import StatusBadge from "./StatusBadge";

const AppointmentTable = ({ appointments, updateStatus }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="p-3 text-left">Student</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Time</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {appointments.map((appointment, index) => (
                        <tr key={index} className="border-t">

                            <td className="p-3">
                                {appointment.student}
                            </td>

                            <td className="p-3">
                                {appointment.date}
                            </td>

                            <td className="p-3">
                                {appointment.time}
                            </td>

                            <td className="p-3">
                                <StatusBadge status={appointment.status} />
                            </td>

                            <td className="p-3 space-x-2">

                                <button
                                    onClick={() => updateStatus(index, "approved")}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => updateStatus(index, "rejected")}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Reject
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default AppointmentTable;