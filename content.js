const CONFIG = {
  score: {
    high: 1000,
    medium: 600,
    low: 400
  },
  comments: {
    high: 500,
    medium: 200
  },
  colors: {
    keyword: 'blue',
    hotPost: 'red'
  }
};

function parseTitleLineElement(titlelineElement, onTitleLine) {
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
    linkA.style.color = CONFIG.colors.keyword;
  }

  if (matchUrls.some(matchUrl => url.match(matchUrl))) {
    const linkA = titlelineElement.querySelector('a');
    linkA.style.color = CONFIG.colors.keyword;
  }

  const commentsThresholdHigh = CONFIG.comments.high;
  const commentsThresholdMedium = CONFIG.comments.medium;
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

  const scoreThresholdHigh = CONFIG.score.high;
  const scoreThresholdMedium = CONFIG.score.medium;
  const scoreThresholdLow = CONFIG.score.low;
  switch (true) {
    case (score >= scoreThresholdHigh): {
      const linkA = titlelineElement.querySelector('a');
      highlightLink(linkA, CONFIG.colors.hotPost, 'bold', 'underline');
      addIcon(linkA, '🔥🔥🔥 ');
      break;
    }
    case (score >= scoreThresholdMedium): {
      const linkA = titlelineElement.querySelector('a');
      highlightLink(linkA, CONFIG.colors.hotPost, 'bold');
      addIcon(linkA, '🔥🔥 ');
      break;
    }
    case (score >= scoreThresholdLow): {
      const linkA = titlelineElement.querySelector('a');
      highlightLink(linkA, CONFIG.colors.hotPost);
      addIcon(linkA, '🔥 ');
      break;
    }
  }
}

// TOOD: Limit the number or keywords and urls that can be stored.
chrome.storage.sync.get(['keywords', 'urls'], function (result) {
  matchKeywords = result.keywords || [];
  matchUrls = result.urls || [];

  document.querySelectorAll('.titleline').forEach(titlelineElement => {
    parseTitleLineElement(titlelineElement, onTitleLine);
  });
});
