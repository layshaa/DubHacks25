export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const { userText, selectedLanguage } = await request.json();

        if (!userText) {
          return new Response(JSON.stringify({ error: "Missing userText input." }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
          apiKey: "AIzaSyD4_mHamtAUS6T1sUz82KsnioDoUJxhA5k",
        });

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

        return new Response(JSON.stringify({ result: response.response.text }), {
          headers: corsHeaders,
        });

      } catch (err) {
        console.error("Gemini AI error:", err);
        return new Response(JSON.stringify({ error: "Failed to process AI request." }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response(JSON.stringify({ error: "Send a POST request with userText" }), {
      status: 400,
      headers: corsHeaders,
    });
  },
};
