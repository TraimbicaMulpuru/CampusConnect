import express from "express";
import {
  addPlacement,
  getPlacements,
  applyPlacement,
  getApplicants,
  deletePlacement,
} from "../controllers/placementController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin - Add Placement Drive
router.post(
  "/",
  protect,
  authorize("admin"),
  addPlacement
);

// Everyone Logged In - View Placement Drives
router.get(
  "/",
  protect,
  getPlacements
);

// Student - Apply for Placement
router.post(
  "/:id/apply",
  protect,
  authorize("student"),
  applyPlacement
);

// Admin - View Applicants
router.get(
  "/:id/applicants",
  protect,
  authorize("admin"),
  getApplicants
);

// Admin - Delete Placement
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePlacement
);

export default router;