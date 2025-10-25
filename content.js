function getPageContent() {
  return document.body.innerText.trim(); // Or use document.body.innerHTML
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    sendResponse({ content: getPageContent() });
  }
});
