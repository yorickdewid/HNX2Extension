const DEFAULT_CONFIG = {
  score: {
    high: 1000,
    medium: 600,
    low: 400
  },
  comments: {
    high: 500,
    medium: 200
  },
  keywords: [],
  urls: []
};

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.sync.set(DEFAULT_CONFIG);
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
