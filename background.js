chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (/^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./axiosJS/axios.js"],
      })
      .then(() => {
        console.log("Injected Axios");
      });
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./foreground.js"],
      })
      .then(() => {
        console.log("Injected Foreground");
      });
  }
});
