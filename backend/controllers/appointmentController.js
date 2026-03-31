import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
    try {
        const { counsellorId, date, time, reason, type } = req.body;
        const studentId = req.user.id;

        const appointment = new Appointment({
            student: studentId,
            counsellor: counsellorId,
            date,
            time,
            reason,
            type,
            roomId: `room-${Math.random().toString(36).substr(2, 9)}`,
            status: "pending"
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY APPOINTMENTS (Student)
export const getMyAppointments = async (req, res) => {
    try {
        const studentId = req.user.id;
        const appointments = await Appointment.find({ student: studentId })
            .populate("counsellor", "fullName email specialization")
            .sort({ date: 1 });

        res.json({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COUNSELLOR APPOINTMENTS
export const getCounsellorAppointments = async (req, res) => {
    try {
        const counsellorId = req.user.id;
        const appointments = await Appointment.find({ counsellor: counsellorId })
            .populate("student", "fullName email studentId program phone")
            .sort({ date: 1 });

        res.json({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE STATUS
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            message: "Appointment status updated",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COUNSELLORS
export const getCounsellors = async (req, res) => {
    try {
        const counsellors = await User.find({ role: "counsellor", isApproved: true })
            .select("fullName email specialization rating phone experience about");

        res.json({
            success: true,
            data: counsellors
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// START MEETING
export const startMeeting = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );

        res.json({
            success: true,
            message: "Meeting started",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET APPOINTMENT BY ROOM ID
export const getAppointmentByRoomId = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ roomId: req.params.roomId })
            .populate("student", "fullName")
            .populate("counsellor", "fullName");

        if (!appointment) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// END MEETING
export const endMeeting = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { new: true }
        );

        res.json({
            success: true,
            message: "Meeting ended",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};