import Appointment from "../models/Appointment.js";

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;

    const appointment = await Appointment.create({
      title,
      description,
      date,
      time,
      location,
      requestedBy: req.user._id,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("requestedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
