// Automatically switch API URL for local dev vs deployed Worker
const API_URL = window.location.hostname.includes("127.0.0.1")
  ? "http://127.0.0.1:8787"
  : "https://dubhacks25.klau248.workers.dev";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  const userText = document.getElementById("userText").value.trim();
  const selectedLanguage = "English"; // Can later add a dropdown for language

  if (!userText) {
    output.textContent = "Please enter some text.";
    return;
  }

  output.textContent = "Loading...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText, selectedLanguage }),
    });

    const data = await res.json();

    if (data.error) {
      output.textContent = "Error: " + data.error;
    } else {
      // Show AI output nicely
      const formatted = data.result
        .replace(/- \*\*Summary:\*\*/i, "Summary:")
        .replace(/- \*\*Simplified Explanation:\*\*/i, "\nSimplified Explanation:")
        .replace(/- \*\*Translation:\*\*/i, "\nTranslation:");

      output.textContent = formatted;
    }
  } catch (err) {
    console.error("Error:", err);
    output.textContent = "Failed to get AI response.";
  }
});
