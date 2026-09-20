import express from "express";
import {
  createLostFound,
  getLostFound,
  deleteLostFound,
} from "../controllers/lostFoundController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("student", "faculty", "admin"),
  createLostFound
);

router.get("/", protect, getLostFound);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteLostFound
);

export default router;