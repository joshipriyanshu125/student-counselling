
import React, { useEffect, useState } from "react"
import API from "../api/api"
import toast from "react-hot-toast"
import AppointmentCard from "../components/AppointmentCard"

const CounsellorAppointments = () => {

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchAppointments = async () => {

        try {

            const token = localStorage.getItem("token")

            const res = await API.get("/appointments/counsellor", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.data && res.data.success) {
                setAppointments(res.data.data)
            }

        } catch (error) {

            console.error("Fetch appointments error:", error.response?.data)
            toast.error("Failed to load appointments")

        }

    }

    useEffect(() => {
        fetchAppointments()
    }, [])


    const updateStatus = async (id, status) => {

        try {

            setLoading(true)

            const token = localStorage.getItem("token")

            const res = await API.patch(
                `/appointments/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (res.data && res.data.success) {

                toast.success(`Appointment ${status}`)
                fetchAppointments()

            } else {

                toast.error(res.data.message || "Failed to update appointment")

            }

        } catch (error) {

            console.error("Update error:", error.response?.data)

            toast.error(
                error.response?.data?.message || "Failed to update appointment"
            )

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Counsellor Appointments
            </h1>

            {appointments.length === 0 && (
                <p className="text-gray-500">No appointments</p>
            )}

            <div className="space-y-4">

                {appointments.map((apt) => (

                    <AppointmentCard
                        key={apt._id}
                        appointment={apt}
                        updateStatus={updateStatus}
                        loading={loading}
                    />

                ))}

            </div>

        </div>

    )

}

export default CounsellorAppointments
