import Classroom from "../models/Classroom.js";

// Admin - Add Classroom
export const addClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Everyone - View Classrooms
export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student/Faculty - Reserve Classroom
export const reserveClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });

    const { date, timeSlot, purpose } = req.body;

    classroom.reservations.push({
      user: req.user._id,
      date,
      timeSlot,
      purpose,
    });

    await classroom.save();

    res.status(200).json({
      message: "Reservation submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - View Reservations
export const getReservations = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("reservations.user", "name email");

    res.status(200).json(classroom.reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Update Reservation Status
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid reservation status" });
    }

    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const reservation = classroom.reservations.id(req.params.reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = status;

    await classroom.save();

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Delete Classroom
export const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });

    await classroom.deleteOne();

    res.status(200).json({
      message: "Classroom deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};