document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const userText = document.getElementById("userText").value.trim();
  const selectedLanguage = document.getElementById("language").value;

  try {
    const res = await fetch("http://localhost:3000/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText, selectedLanguage }),
    });

    const data = await res.json(); // <-- use json() here
    document.getElementById("output").textContent = data.result; // <-- use data.result
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("output").textContent = "Failed to get AI response.";
  }
});
