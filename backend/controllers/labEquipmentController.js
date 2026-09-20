import LabEquipment from "../models/LabEquipment.js";

// Admin - Add Equipment
export const addEquipment = async (req, res) => {
  try {
    const equipment = await LabEquipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Everyone - View Equipment
export const getEquipment = async (req, res) => {
  try {
    const equipment = await LabEquipment.find();
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student - Book Equipment
export const bookEquipment = async (req, res) => {
  try {
    const equipment = await LabEquipment.findById(req.params.id);

    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    if (equipment.available <= 0)
      return res.status(400).json({ message: "Equipment unavailable" });

    equipment.bookings.push({
      student: req.user._id,
    });

    equipment.available--;

    await equipment.save();

    res.status(200).json({
      message: "Equipment booked successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - View All Bookings
export const getBookings = async (req, res) => {
  try {
    const equipment = await LabEquipment.findById(req.params.id)
      .populate("bookings.student", "name email");

    res.status(200).json(equipment.bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Delete Equipment
export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await LabEquipment.findById(req.params.id);

    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    await equipment.deleteOne();

    res.status(200).json({
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};