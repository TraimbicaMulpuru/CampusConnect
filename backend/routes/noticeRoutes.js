import express from "express";
import {
  createNotice,
  getNotices,
  deleteNotice,
} from "../controllers/noticeController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Faculty/Admin can create notices
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createNotice
);

// Everyone logged in can view notices
router.get("/", protect, getNotices);

// Admin can delete notices
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteNotice
);

export default router;