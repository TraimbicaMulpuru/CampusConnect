import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Returned"],
    default: "Pending",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const labEquipmentSchema = new mongoose.Schema(
  {
    equipmentName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookings: [bookingSchema],
  },
  {
    timestamps: true,
  }
);

const LabEquipment = mongoose.model(
  "LabEquipment",
  labEquipmentSchema
);

export default LabEquipment;