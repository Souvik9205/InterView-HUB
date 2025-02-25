const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateContent = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};
