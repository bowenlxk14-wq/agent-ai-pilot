import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    dailyCompletion: 0.52,
    outreachRate: 0.67,
    conversions: 0.18,
    note: "Placeholder metrics for MVP."
  });
});

export default router;
