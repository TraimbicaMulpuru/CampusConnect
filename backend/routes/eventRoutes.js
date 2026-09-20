import express from "express";

import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/eventController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createEvent
);

router.get("/", protect, getEvents);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEvent
);

export default router;