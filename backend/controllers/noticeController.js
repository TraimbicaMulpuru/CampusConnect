import Notice from "../models/Notice.js";

// Create Notice
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      title: req.body.title,
      description: req.body.description,
      postedBy: req.user._id,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate("postedBy", "name role");
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Notice
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};