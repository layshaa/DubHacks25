// NOTE: For this to work in a modern browser, you need to have the
// @google/genai package installed and bundled, or imported as a module.
// In a simple <script type="module"> setup, you would typically use an importmap
// or a build process (like webpack/vite) to resolve this import.
import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai/+esm';

// --- IMPORTANT SECURITY WARNING ---
// Directly embedding your API key in client-side code (like in the browser)
// is highly discouraged for production applications as it exposes your key to all users.
// This example is for prototyping only. For production, use a server-side proxy
// or a secure service like Firebase AI Logic.
const GEMINI_API_KEY = "AIzaSyD4_mHamtAUS6T1sUz82KsnioDoUJxhA5k"; // <-- Replace with your actual key

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// Assuming you have an HTML element with id="output" to display the result
const output = document.getElementById("output");

// The modified event listener
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  // 1. Update the UI to show waiting state
  output.textContent = "Waiting for Gemini response...";

  try {
    const model = 'gemini-2.5-flash'; // 'gemini-flash-latest' is often an alias for the latest flash model

    // Tools configuration (Google Search grounding)
    const tools = [
      {
        googleSearch: {}
      },
    ];

    // Configuration for the generation request
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

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
`;
    // The content for the model to respond to
    const contents = [
      {
        role: 'user',
        parts: [
          {
            // You can replace this with user input from another element
            text: prompt + "\n" + document.getElementById("userText").value.trim(),
          },
        ],
      },
    ];

    // 2. Call the Gemini model with streaming
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // 3. Clear the initial 'waiting...' text to start streaming
    output.textContent = "";

    // 4. Iterate over the stream and update the output in real-time
    for await (const chunk of responseStream) {
      // Append the new text chunk to the output element
      output.textContent += chunk.text;
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    output.textContent = "An error occurred: " + error.message;
  }

});