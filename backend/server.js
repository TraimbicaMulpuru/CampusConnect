import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import labEquipmentRoutes from "./routes/labEquipmentRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 CampusConnect API is Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/lab-equipment", labEquipmentRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/appointments", appointmentRoutes);

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});