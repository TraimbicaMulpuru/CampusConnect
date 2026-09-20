import express from "express";
import {
  addEquipment,
  getEquipment,
  bookEquipment,
  getBookings,
  deleteEquipment,
} from "../controllers/labEquipmentController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), addEquipment);

router.get("/", protect, getEquipment);

router.post(
  "/:id/book",
  protect,
  authorize("student"),
  bookEquipment
);

router.get(
  "/:id/bookings",
  protect,
  authorize("admin"),
  getBookings
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEquipment
);

export default router;