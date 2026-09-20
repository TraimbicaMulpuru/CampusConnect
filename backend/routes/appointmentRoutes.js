import express from "express";

import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student/Faculty can create appointments
router.post(
  "/",
  protect,
  authorize("student", "faculty"),
  createAppointment
);

// Any logged-in user can view appointments
router.get(
  "/",
  protect,
  getAppointments
);

// Faculty/Admin can approve or reject
router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateAppointmentStatus
);

// Admin can delete
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAppointment
);

export default router;
