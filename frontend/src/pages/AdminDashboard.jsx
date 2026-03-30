import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const [counsellors, setCounsellors] = useState([]);

    const fetchCounsellors = async () => {
        try {
            const res = await API.get("/admin/pending-counsellors");
            setCounsellors(res.data.data);
        } catch {
            toast.error("Failed to load counsellors");
        }
    };

    const approveCounsellor = async (id) => {
        try {
            await API.put(`/admin/approve/${id}`);
            toast.success("Counsellor approved");
            fetchCounsellors(); // refresh
        } catch {
            toast.error("Approval failed");
        }
    };

    useEffect(() => {
        fetchCounsellors();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Pending Counsellors</h1>

            {counsellors.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                counsellors.map((c) => (
                    <div key={c._id} className="border p-4 mb-4 rounded-lg">
                        <p><b>Name:</b> {c.fullName}</p>
                        <p><b>Email:</b> {c.email}</p>

                        <button
                            onClick={() => approveCounsellor(c._id)}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Approve
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminDashboard;