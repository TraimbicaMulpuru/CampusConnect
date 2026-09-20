import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    eligibilityCGPA: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.model("Placement", placementSchema);

export default Placement;