import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const classroomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    reservations: [reservationSchema],
  },
  {
    timestamps: true,
  }
);

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;