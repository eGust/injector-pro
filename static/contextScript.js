chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'fetch_body') {
    sendResponse(document.body.innerHTML);
  }
});
