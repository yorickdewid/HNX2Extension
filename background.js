const refreshInterval = 3 * 60 * 1000;

function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    }
  });
}

// setInterval(reloadActiveTab, refreshInterval);