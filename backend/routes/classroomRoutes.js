import express from "express";
import {
  addClassroom,
  getClassrooms,
  reserveClassroom,
  getReservations,
  updateReservationStatus,
  deleteClassroom,
} from "../controllers/classroomController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), addClassroom);

router.get("/", protect, getClassrooms);

router.post(
  "/:id/reserve",
  protect,
  authorize("student", "faculty"),
  reserveClassroom
);

router.get(
  "/:id/reservations",
  protect,
  authorize("admin"),
  getReservations
);

router.put(
  "/:id/reservations/:reservationId",
  protect,
  authorize("admin"),
  updateReservationStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteClassroom
);

export default router;