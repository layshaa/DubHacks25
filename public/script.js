document.getElementById("analyzeBtn").addEventListener("click", async () => {

  console.log("the button was clicked");
  const userText = document.getElementById("userText").value.trim();
  const selectedLanguage = "English";               // document.getElementById("language").value;

  try {
    const res = await fetch("https://dubhacks25.klau248.workers.dev", { // <-- update with your Worker URL
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
