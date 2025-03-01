function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .titleline a.hnx-keyword, 
    a.hnx-keyword { 
      color: blue !important; 
    }
    
    .titleline a.hnx-hot, 
    a.hnx-hot { 
      color: red !important; 
      font-weight: bold !important; 
    }
    
    .titleline a.hnx-very-hot, 
    a.hnx-very-hot { 
      color: red !important; 
      font-weight: bold !important; 
      text-decoration: underline !important; 
    }
  `;
  document.head.appendChild(style);
}
addStyles();

const DEFAULT_CONFIG = {
  score: {
    high: 1000,
    medium: 600,
    low: 400
  },
  comments: {
    high: 500,
    medium: 200
  }
};

const MAX_KEYWORDS = 100;
const MAX_URLS = 100;

function parseTitleLineElement(titlelineElement, onTitleLine) {
  try {
    const parentTr = titlelineElement.closest('tr');

    const linkA = titlelineElement.querySelector('a');
    const text = linkA.textContent;
    const url = linkA.href;

    var score = 0;
    var comments = 0;

    const nextTr = parentTr.nextElementSibling;
    if (nextTr) {
      const scoreElement = nextTr.querySelector('.score');

      if (scoreElement) {
        const scoreText = scoreElement.textContent;
        const match = scoreText.match(/(\d+)\spoints/);
        score = parseInt(match[1], 10);
      }

      const aElements = nextTr.querySelectorAll('a');
      aElements.forEach(a => {
        if (a.textContent.includes('comments')) {
          const match = a.textContent.match(/(\d+)\scomments/);
          comments = parseInt(match[1], 10);
        }
      });
    }

    onTitleLine(titlelineElement, text, url, score, comments);
  } catch (error) {
    console.error('Error parsing title line:', error, titlelineElement);
  }
}

/**
 * Creates an icon element with the given text.
 * 
 * @param {string} iconText The text to display in the icon element.
 * @returns {HTMLSpanElement} The icon element.
 */
function createIcon(iconText) {
  const icon = document.createElement('span');
  icon.textContent = iconText;
  return icon;
}

function highlightLink(linkA, color, weight = 'normal', decoration = 'none') {
  linkA.style.color = color;
  if (weight !== 'normal') linkA.style.fontWeight = weight;
  if (decoration !== 'none') linkA.style.textDecoration = decoration;
}

function addIcon(linkA, iconText) {
  linkA.insertBefore(createIcon(iconText), linkA.firstChild);
}

var matchKeywords = [];
var matchUrls = [];
var config = DEFAULT_CONFIG;

/**
 * Callback function for the title line element.
 * 
 * @param {HTMLElement} titlelineElement The title line element.
 * @param {string} title The title of the post.
 * @param {string} url The URL of the post.
 * @param {number} score The score of the post.
 * @param {number} comments The number of comments of the post.
 * @returns {void}
 */
const onTitleLine = (titlelineElement, title, url, score, comments) => {
  if (matchKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
    const linkA = titlelineElement.querySelector('a');
    linkA.classList.add('hnx-keyword');
  }

  if (matchUrls.some(matchUrl => url.match(matchUrl))) {
    const linkA = titlelineElement.querySelector('a');
    linkA.classList.add('hnx-keyword');
  }

  const commentsThresholdHigh = config.comments.high;
  const commentsThresholdMedium = config.comments.medium;
  switch (true) {
    case (comments >= commentsThresholdHigh): {
      const linkA = titlelineElement.querySelector('a');
      addIcon(linkA, '💬💬 ');
      break;
    }
    case (comments >= commentsThresholdMedium): {
      const linkA = titlelineElement.querySelector('a');
      addIcon(linkA, '💬 ');
      break;
    }
  }

  const scoreThresholdHigh = config.score.high;
  const scoreThresholdMedium = config.score.medium;
  const scoreThresholdLow = config.score.low;
  switch (true) {
    case (score >= scoreThresholdHigh): {
      const linkA = titlelineElement.querySelector('a');
      linkA.classList.add('hnx-very-hot');
      addIcon(linkA, '🔥🔥🔥 ');
      break;
    }
    case (score >= scoreThresholdMedium): {
      const linkA = titlelineElement.querySelector('a');
      linkA.classList.add('hnx-hot');
      addIcon(linkA, '🔥🔥 ');
      break;
    }
    case (score >= scoreThresholdLow): {
      const linkA = titlelineElement.querySelector('a');
      linkA.classList.add('hnx-hot');
      addIcon(linkA, '🔥 ');
      break;
    }
  }
}

chrome.storage.sync.get(['keywords', 'urls', 'score', 'comments'], function (result) {
  matchKeywords = (result.keywords || []).slice(0, MAX_KEYWORDS);
  matchUrls = (result.urls || []).slice(0, MAX_URLS);

  if (result.score) config.score = result.score;
  if (result.comments) config.comments = result.comments;

  document.querySelectorAll('.titleline').forEach(titlelineElement => {
    parseTitleLineElement(titlelineElement, onTitleLine);
  });
});

chrome.storage.onChanged.addListener((changes) => {
  let needsRefresh = false;

  if (changes.keywords) {
    matchKeywords = (changes.keywords.newValue || []).slice(0, MAX_KEYWORDS);
    needsRefresh = true;
  }

  if (changes.urls) {
    matchUrls = (changes.urls.newValue || []).slice(0, MAX_URLS);
    needsRefresh = true;
  }

  if (changes.score) {
    config.score = changes.score.newValue || DEFAULT_CONFIG.score;
    needsRefresh = true;
  }

  if (changes.comments) {
    config.comments = changes.comments.newValue || DEFAULT_CONFIG.comments;
    needsRefresh = true;
  }

  if (needsRefresh) {
    // Re-apply to existing elements
    document.querySelectorAll('.titleline').forEach(titlelineElement => {
      // Remove existing classes and icons before reapplying
      const linkA = titlelineElement.querySelector('a');
      if (linkA) {
        linkA.classList.remove('hnx-keyword', 'hnx-hot', 'hnx-very-hot');

        // Remove icons (emoji spans)
        Array.from(linkA.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE &&
            (node.textContent.includes('🔥') || node.textContent.includes('💬'))) {
            linkA.removeChild(node);
          }
        });
      }

      parseTitleLineElement(titlelineElement, onTitleLine);
    });
  }
});

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const titlelines = node.classList?.contains('titleline') ?
          [node] : Array.from(node.querySelectorAll('.titleline'));

        titlelines.forEach(titleline => {
          parseTitleLineElement(titleline, onTitleLine);
        });
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
