import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

// Any logged-in user
router.get("/profile", protect, getProfile);

// Student only
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student!",
    });
  }
);

// Faculty only
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  (req, res) => {
    res.json({
      message: "Welcome Faculty!",
    });
  }
);

// Admin only
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
    });
  }
);

export default router;