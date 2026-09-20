import Placement from "../models/Placement.js";

// Add Placement Drive (Admin)
export const addPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    res.status(201).json(placement);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Placement Drives
export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find();

    res.status(200).json(placements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Student Apply for Placement
export const applyPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        message: "Placement drive not found",
      });
    }

    if (placement.applicants.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    placement.applicants.push(req.user._id);

    await placement.save();

    res.status(200).json({
      message: "Applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// View Applicants (Admin)
export const getApplicants = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate("applicants", "name email role");

    if (!placement) {
      return res.status(404).json({
        message: "Placement drive not found",
      });
    }

    res.status(200).json(placement.applicants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Placement (Admin)
export const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        message: "Placement drive not found",
      });
    }

    await placement.deleteOne();

    res.status(200).json({
      message: "Placement deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};