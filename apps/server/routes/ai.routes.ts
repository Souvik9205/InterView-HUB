import { Router } from "express";
import { generateContent } from "../utils/Gemini.api";

const aiRouter = Router();

aiRouter.post("/evaluate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }
  try {
    const data = await generateContent(prompt);
    res.status(200).json({ message: "Success", data });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

aiRouter.post("/follow-up", async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
    res.status(400).json({ message: "Answer is required" });
    return;
  }
  const prompt = `
        Reac the following answer in a certain topic:
        Answer: ${answer}

        analyse the answer and provide another follow up question on the same topic as the answer but not the same question

        Return your answer in the EXACT format:
        <follow up question>
    `;
  try {
    const data = await generateContent(prompt);
    res.status(200).json({ message: "Success", data });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default aiRouter;
