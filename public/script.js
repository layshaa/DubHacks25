document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const userText = document.getElementById("userText").value.trim();
  const selectedLanguage = document.getElementById("language").value;

  try {
    const res = await fetch("https://YOUR_WORKER_SUBDOMAIN.workers.dev", { // <-- update with your Worker URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText, selectedLanguage }),
    });

    const data = await res.json();
    document.getElementById("output").textContent = data.result;
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("output").textContent = "Failed to get AI response.";
  }
});
