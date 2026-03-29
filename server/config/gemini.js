import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing. Set it in /server/.env.");
}

const genAI = new GoogleGenerativeAI(apiKey);
export const MODEL_NAME = "gemini-flash-latest";
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export default model;
