import { Router } from "express";
import complianceFilter from "../middleware/complianceFilter.js";
import model, { MODEL_NAME } from "../config/gemini.js";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const { targetAudience } = req.body || {};

    const systemPrompt =
      "You are a social media copywriter for an independent insurance broker. Write content that sounds warm, human, and relatable — NOT corporate. Avoid jargon. The goal is to generate curiosity and trust, and always end with a soft CTA directing readers to book a free 15-minute insurance coverage review. Never use the following phrases: '100% payout', 'lowest premium in the US', 'guaranteed returns', 'official insurer statement'. Always add this disclaimer where relevant: 'Actual coverage subject to underwriting results.'";

    const prompt = `${systemPrompt}\n\nTarget audience: ${
      targetAudience || "General audience"
    }\n\nReturn a JSON object with keys: headlines (array of 3), postCopy (100-150 words), cta.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let parsed;
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      parsed = {
        headlines: [
          text.split("\n")[0],
          text.split("\n")[1],
          text.split("\n")[2]
        ].filter(Boolean),
        postCopy: text,
        cta: "Book your free 15-minute coverage review"
      };
    }
    const headlineIdeas = parsed.headlines || [];
    const postCopy = parsed.postCopy || "";
    const cta = parsed.cta || "";

    const filteredHeadlines = headlineIdeas.map((item) =>
      complianceFilter(item)
    );
    const filteredPostCopy = complianceFilter(postCopy);
    const filteredCta = complianceFilter(cta);

    res.json({
      model: MODEL_NAME,
      systemPrompt,
      headlines: filteredHeadlines,
      postCopy: filteredPostCopy,
      cta: filteredCta,
      note: "Generated with Gemini."
    });
  } catch (error) {
    console.error("[Content Generate Error]", error);
    res.status(502).json({
      error: "Failed to generate content.",
      details: error?.message || "Unknown error"
    });
  }
});

export default router;
