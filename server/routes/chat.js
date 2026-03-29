import { Router } from "express";
import complianceFilter from "../middleware/complianceFilter.js";
import model, { MODEL_NAME } from "../config/gemini.js";

const router = Router();

router.post("/reply", async (req, res) => {
  try {
    const { clientMessage, mode } = req.body || {};

    const trustPrompt =
      "You are a warm, empathetic insurance advisor. The agent has received a message from a potential client. Write a reply that acknowledges their concern, builds rapport, and offers helpful information — do NOT ask for contact details or push for a meeting yet. Sound human and conversational, not salesy. Always identify yourself as an insurance advisor, never as an AI or automated system.";
    const conversionPrompt =
      "You are a confident insurance advisor. The agent has received a message from a potential client who seems engaged. Write a reply that moves the conversation forward — politely ask for their phone number or suggest booking a free 15-minute consultation. Be warm but purposeful. Always identify yourself as an insurance advisor, never as an AI or automated system.";

    const systemPrompt = mode === "conversion" ? conversionPrompt : trustPrompt;

    const prompt = `${systemPrompt}\n\nClient message: ${clientMessage || ""}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const reply = text;

    const filtered = complianceFilter(reply);

    res.json({
      model: MODEL_NAME,
      systemPrompt,
      reply: filtered,
      note: "Generated with Gemini."
    });
  } catch (error) {
    console.error("[Chat Reply Error]", error);
    res.status(502).json({
      error: "Failed to generate reply.",
      details: error?.message || "Unknown error"
    });
  }
});

export default router;
