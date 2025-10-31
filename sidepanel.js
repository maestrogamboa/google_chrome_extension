let stopGeneration = false;
const fetchButton = document.getElementById("fetchContent");
const scrollStatus = document.getElementById("scroll-status");
scrollStatus.textContent = ""
const toneSelect = document.getElementById("toneSelect");

fetchButton.addEventListener("click", async () => {
  // If generation is running and user clicks again → stop it
  if (fetchButton.textContent === "Pause Feed ✋") {
    stopGeneration = true;
    fetchButton.textContent = "Feed Me 🍿";
    console.log("Stopping generation...");
    return;
  }

  // Otherwise → start generation
  stopGeneration = false;
  fetchButton.textContent = "Pause Feed ✋";
  scrollStatus.textContent = "CONTENT INCOMING.."

  const output = document.getElementById("output");
  const imageOutput = document.getElementById("image-output");
  output.textContent = "Fetching page content...";

  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send message to content script
  chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("No content script found:", chrome.runtime.lastError.message);
      output.textContent = "Could not connect to the page. Try refreshing it.";
      fetchButton.textContent = "Fetch Content";
      return;
    }

    if (!response || !response.content) {
      output.textContent = "No content received.";
      fetchButton.textContent = "Feed Me 🍿";
      return;
    }

    // Run the generation
    generateDoomscrollWithImages(response.content)
      .then(() => {
        // Once finished, reset button
        fetchButton.textContent = "Feed Me 🍿";
         scrollStatus.textContent = "CONTENT STOPPED..."
      })
      .catch((err) => {
        console.error("Generation error:", err);
        fetchButton.textContent = "Feed Me 🍿";
         scrollStatus.textContent = "CONTENT STOPPED..."
      });
  });
});

async function generateDoomscrollWithImages(articleText) {
  const output = document.getElementById("output");
  output.textContent = "";

  if (!("LanguageModel" in window)) {
    output.textContent = "Prompt API not available.";
    return;
  }

  const available = await LanguageModel.availability();
  if (available === "unavailable") {
    output.textContent = "Gemini Nano unavailable.";
    return;
  }

  const session = await LanguageModel.create({ temperature: 0.8, topK: 40 });
  const prompt = `
Rewrite the content of this webpage as a series of short, standalone sections designed for doomscroll-style reading.

Tone:${toneSelect}

Each section should:

Capture a single, complete idea, scene, or emotional moment from the article.

Be engaging, conversational, and easy to read — like something you’d see while scrolling through social media.

Flow naturally with good grammar, vivid phrasing, and a touch of storytelling.

Be understandable on its own, even if someone only reads that one part.

End each section with the word “Section” on its own line to clearly separate chunks.

Remove all markdown symbols like #, *, **, and any numbered prefixes like "1/10", "2/10", etc.
Keep only the plain text and emojis.
Do not include any formatting marks or bullet numbers in the rewritten version.

The goal: make the summary fun, addictive, and visually evocative — something that could pair naturally with an image or GIF for each section.

Article:
${articleText}
`;

  const stream = session.promptStreaming(prompt);
  let chunkBuffer = "";

  for await (const chunk of stream) {
    if (stopGeneration) {
      console.log("Generation stopped by user.");
      await session.destroy?.();
      scrollStatus.textContent = "CONTENT STOPPED..."
      break;
    }

    chunkBuffer += chunk;

    if (chunkBuffer.includes("Section")) {
      const text = chunkBuffer.replace("Section", "").replace("*", "").trim();
      await appendTextAndImage(output, text);
      chunkBuffer = "";
    }
  }
  console.log(chunkBuffer)

  // Handle leftover text if generation completed normally
  if (!stopGeneration && chunkBuffer.trim().length > 0) {
    await appendTextAndImage(output, chunkBuffer.trim());
  }

  await session.destroy?.();
}

/**
 * Helper function: appends text + generated image to output container
 */
async function appendTextAndImage(output, text) {
  const chunkContainer = document.createElement("div");
  chunkContainer.style.marginBottom = "2em";

  const textEl = document.createElement("p");
  textEl.classList.add("my-paragraph");
  textEl.textContent = text;
  chunkContainer.appendChild(textEl);

  try {
    const res = await fetch("https://gen-lang-client-0334461813.ey.r.appspot.com/generate-text-and-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await res.json();
    if (data.image) {
      const img = document.createElement("img");
      img.src = data.image;
      img.style.maxWidth = "100%";
      img.style.marginTop = "0.5em";
      chunkContainer.appendChild(img);
    }
  } catch (err) {
    console.warn("Image generation failed:", err);
  }

  output.appendChild(chunkContainer);
}
