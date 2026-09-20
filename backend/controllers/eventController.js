import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate(
      "createdBy",
      "name role"
    );

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};