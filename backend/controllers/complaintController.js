import Complaint from "../models/Complaint.js";

// Student creates complaint
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      raisedBy: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// View all complaints
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate(
      "raisedBy",
      "name email role"
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = req.body.status || complaint.status;

    await complaint.save();

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};