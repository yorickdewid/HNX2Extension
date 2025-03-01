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

function saveOptions() {
  const keywords = document.getElementById('keywordsTextarea').value
    .split('\n')
    .map(k => k.trim())
    .filter(k => k !== '');
  
  const urls = document.getElementById('urlsTextarea').value
    .split('\n')
    .map(u => u.trim())
    .filter(u => u !== '');
  
  const scoreHigh = parseInt(document.getElementById('scoreHigh').value) || DEFAULT_CONFIG.score.high;
  const scoreMedium = parseInt(document.getElementById('scoreMedium').value) || DEFAULT_CONFIG.score.medium;
  const scoreLow = parseInt(document.getElementById('scoreLow').value) || DEFAULT_CONFIG.score.low;
  const commentsHigh = parseInt(document.getElementById('commentsHigh').value) || DEFAULT_CONFIG.comments.high;
  const commentsMedium = parseInt(document.getElementById('commentsMedium').value) || DEFAULT_CONFIG.comments.medium;
  
  const config = {
    keywords,
    urls,
    score: {
      high: scoreHigh,
      medium: scoreMedium,
      low: scoreLow
    },
    comments: {
      high: commentsHigh,
      medium: commentsMedium
    }
  };

  chrome.storage.sync.set(config, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved!';
    status.className = 'status success';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  });
}

// Restore options from chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
    document.getElementById('keywordsTextarea').value = (items.keywords || []).join('\n');
    document.getElementById('urlsTextarea').value = (items.urls || []).join('\n');
    
    document.getElementById('scoreHigh').value = items.score?.high || DEFAULT_CONFIG.score.high;
    document.getElementById('scoreMedium').value = items.score?.medium || DEFAULT_CONFIG.score.medium;
    document.getElementById('scoreLow').value = items.score?.low || DEFAULT_CONFIG.score.low;
    document.getElementById('commentsHigh').value = items.comments?.high || DEFAULT_CONFIG.comments.high;
    document.getElementById('commentsMedium').value = items.comments?.medium || DEFAULT_CONFIG.comments.medium;
  });
}

// Reset options to defaults
function resetOptions() {
  document.getElementById('keywordsTextarea').value = '';
  document.getElementById('urlsTextarea').value = '';
  
  document.getElementById('scoreHigh').value = DEFAULT_CONFIG.score.high;
  document.getElementById('scoreMedium').value = DEFAULT_CONFIG.score.medium;
  document.getElementById('scoreLow').value = DEFAULT_CONFIG.score.low;
  document.getElementById('commentsHigh').value = DEFAULT_CONFIG.comments.high;
  document.getElementById('commentsMedium').value = DEFAULT_CONFIG.comments.medium;

  const status = document.getElementById('status');
  status.textContent = 'Options reset to defaults. Click Save to apply.';
  status.className = 'status success';
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 2000);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
document.getElementById('resetBtn').addEventListener('click', resetOptions);
