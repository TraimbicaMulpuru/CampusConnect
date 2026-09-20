import express from "express";

import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student can create
router.post("/", protect, authorize("student"), createComplaint);

// All logged-in users can view
router.get("/", protect, getComplaints);

// Faculty/Admin can update status
router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateComplaintStatus
);

// Admin can delete
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteComplaint
);

export default router;