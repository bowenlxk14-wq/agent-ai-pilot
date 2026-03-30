import "dotenv/config";
import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";
import contentRoutes from "./routes/content.js";
import chatRoutes from "./routes/chat.js";
import trackerRoutes from "./routes/tracker.js";
import metricsRoutes from "./routes/metrics.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "https://agent-ai-pilot.onrender.com",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Agent AI-Pilot server running" });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/metrics", metricsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
