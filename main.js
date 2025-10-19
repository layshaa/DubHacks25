import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config"; // loads GEMINI_API_KEY from .env

// Initialize Express app
const app = express();
app.use(cors()); // allow requests from your frontend
app.use(express.json()); // parse incoming JSON

// Create Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Route for simplifying/ translating legal text
app.post("/simplify", async (req, res) => {
  try {
    const { userText, selectedLanguage } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "Missing userText input." });
    }

    // Construct the Gemini prompt
    const prompt = `
      You are an expert legal assistant and translator.
      Your role is to help people understand complex legal or governmental documents, articles, or photos of legislature and laws.

      Your tasks:
      1. Read the given text carefully.
      2. Translate and simplify it into clear, easy-to-understand language for the general public — especially students, immigrants, and the elderly.
      3. Avoid legal jargon and use plain explanations about what the law or policy is doing and how it affects people.
      4. If a target language is specified, translate the simplified explanation into that language while keeping the meaning accurate and culturally appropriate.
      5. If no language is specified, default to English.

      Format your response like this:
      - **Summary:** [short summary of what the law/document is about]
      - **Simplified Explanation:** [easy explanation]
      - **Translation:** [translated text, only if a language is given]

      Here is the text to analyze:
      ${userText}

      Target language (if any): ${selectedLanguage || "English"}
    `;

    // Send prompt to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Send Gemini’s response to the frontend
    res.json({ result: response.text });
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
