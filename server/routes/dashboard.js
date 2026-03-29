import { Router } from "express";
import { readFileSync } from "fs";

const leads = JSON.parse(
  readFileSync(new URL("../data/leads.json", import.meta.url))
);

const router = Router();

router.get("/", (req, res) => {
  res.json({
    date: new Date().toISOString().slice(0, 10),
    tasks: [
      { id: "task-1", title: "Review overnight lead updates", completed: false },
      { id: "task-2", title: "Call top 3 renewal prospects", completed: false },
      { id: "task-3", title: "Send 2 policy summaries", completed: true }
    ],
    leads: leads.slice(0, 5)
  });
});

export default router;
