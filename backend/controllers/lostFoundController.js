import LostFound from "../models/LostFound.js";

// Create Lost/Found Item
export const createLostFound = async (req, res) => {
  try {
    const { title, description, type, location, contact } = req.body;

    const item = await LostFound.create({
      title,
      description,
      type,
      location,
      contact,
      postedBy: req.user._id,
    });

    console.log("Saved Item:", item);

    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Lost/Found Items
export const getLostFound = async (req, res) => {
  try {
    const items = await LostFound.find();

    console.log("Items from DB:", items);

    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Lost/Found Item (Admin Only)
export const deleteLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};