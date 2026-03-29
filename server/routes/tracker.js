import { Router } from "express";
import { readFileSync } from "fs";
import complianceFilter from "../middleware/complianceFilter.js";
import model, { MODEL_NAME } from "../config/gemini.js";

const leads = JSON.parse(
  readFileSync(new URL("../data/leads.json", import.meta.url))
);

const router = Router();

router.get("/", (req, res) => {
  res.json({
    followUps: leads.map((lead) => ({
      name: lead.name,
      stage: lead.stage,
      lastContact: lead.lastContact,
      nextStep: "Log follow-up"
    }))
  });
});

router.post("/suggest", async (req, res) => {
  try {
    const { leadName, stage } = req.body || {};
    const systemPrompt =
      "You are an insurance advisor. Write a brief, friendly outreach message for stage [Day 1 / Day 3 / Day 7]. Day 1: introduce yourself warmly. Day 3: share a useful insurance tip or claim story. Day 7: gently re-engage a silent lead. Never be pushy. Never use: '100% payout', 'guaranteed returns', 'lowest premium in the US'. Always sign off as their insurance advisor.";

    const prompt = `${systemPrompt}\n\nLead name: ${
      leadName || "there"
    }\nStage: ${stage || "Day 1"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const filtered = complianceFilter(text);

    res.json({
      model: MODEL_NAME,
      systemPrompt,
      message: filtered,
      note: "Generated with Gemini."
    });
  } catch (error) {
    console.error("[Tracker Suggest Error]", error);
    res.status(502).json({
      error: "Failed to generate suggested message.",
      details: error?.message || "Unknown error"
    });
  }
});

export default router;
