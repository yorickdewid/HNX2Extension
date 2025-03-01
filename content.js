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
    linkA.style.color = 'blue';
  }

  if (matchUrls.some(matchUrl => url.match(matchUrl))) {
    const linkA = titlelineElement.querySelector('a');
    linkA.style.color = 'blue';
  }

  const commentsThresholdHigh = 500;
  const commentsThresholdMedium = 200;
  switch (true) {
    case (comments >= commentsThresholdHigh): {
      const linkA = titlelineElement.querySelector('a');
      linkA.insertBefore(createIcon('💬💬 '), linkA.firstChild);
      break;
    }
    case (comments >= commentsThresholdMedium): {
      const linkA = titlelineElement.querySelector('a');
      linkA.insertBefore(createIcon('💬 '), linkA.firstChild);
      break;
    }
  }

  const scoreThresholdHigh = 1000;
  const scoreThresholdMedium = 600;
  const scoreThresholdLow = 400;
  switch (true) {
    case (score >= scoreThresholdHigh): {
      const linkA = titlelineElement.querySelector('a');
      linkA.style.color = 'red';
      linkA.style.fontWeight = 'bold';
      linkA.style.textDecoration = 'underline';
      linkA.insertBefore(createIcon('🔥🔥🔥 '), linkA.firstChild);
      break;
    }
    case (score >= scoreThresholdMedium): {
      const linkA = titlelineElement.querySelector('a');
      linkA.style.color = 'red';
      linkA.style.fontWeight = 'bold';
      linkA.insertBefore(createIcon('🔥🔥 '), linkA.firstChild);
      break;
    }
    case (score >= scoreThresholdLow): {
      const linkA = titlelineElement.querySelector('a');
      linkA.style.color = 'red';
      linkA.insertBefore(createIcon('🔥 '), linkA.firstChild);
      break;
    }
  }
}

// const keywords = ['Crypto', 'ESP32', 'Wi-Fi', 'Arduino', 'Raspberry Pi', 'LLVM', 'Dutch', 'Netherlands', 'USB'];
// chrome.storage.sync.set({ 'keywords': keywords });

// const urls = ['https://media.ccc.de/*'];
// chrome.storage.sync.set({ 'urls': urls });

// TOOD: Limit the number or keywords and urls that can be stored.
chrome.storage.sync.get(['keywords', 'urls'], function (result) {
  matchKeywords = result.keywords;
  matchUrls = result.urls;

  document.querySelectorAll('.titleline').forEach(titlelineElement => {
    parseTitleLineElement(titlelineElement, onTitleLine);
  });
});
