import { GoogleGenAI } from "@google/genai";

// Create Gemini AI client using Worker secret
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // set with `wrangler secret put GEMINI_API_KEY`
});

export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { userText, selectedLanguage } = await request.json();

        if (!userText) {
          return new Response(JSON.stringify({ error: "Missing userText input." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

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

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        return new Response(JSON.stringify({ result: response.text }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error communicating with Gemini:", error);
        return new Response(JSON.stringify({ error: "Failed to process request." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Send a POST request with userText", { status: 400 });
  },
};
