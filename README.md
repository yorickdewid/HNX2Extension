# Hacker News X2

A browser extension that enhances your Hacker News browsing experience by highlighting posts based on your interests and identifying popular discussions.

## Core Features

- **Keyword-Based Highlighting**: Automatically highlight headlines containing keywords you care about
- **URL Filtering**: Highlight posts from specific domains or websites that matter to you
- **Popular Content Identification**: Easily spot posts with high comment counts and upvotes
- **Customizable Highlighting**: Configure colors and styles to match your preferences

## Why Use Hacker News X2?

- **Find Relevant Content Faster**: No more scanning through dozens of headlines to find topics you're interested in
- **Never Miss Important Discussions**: Instantly identify trending posts with significant community engagement
- **Personalized Experience**: Tailor Hacker News to your specific interests and information needs

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Open your browser and navigate to `chrome://extensions`
3. Enable "Developer Mode"
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension directory

## Setup and Configuration

After installation:

1. Click the extension icon in your browser toolbar to access settings
2. Add keywords related to topics you want to highlight (e.g., "Python", "Machine Learning", "Startup")
3. Add domains of websites you particularly value (e.g., "github.com", "arxiv.org")
4. Customize the thresholds for comment and upvote highlighting
5. Choose your preferred highlight colors for each category

## How It Works

When you browse Hacker News:
- Headlines containing your keywords will be highlighted
- Posts from your specified domains will be highlighted
- Posts exceeding your comment/upvote thresholds will be visually emphasized
- All highlighting happens instantly as the page loads

## Configuration

Access the extension options by:
1. Right-clicking the extension icon in your browser toolbar
2. Selecting "Options" or "Extension options"

Advanced settings include:
- Adjustable thresholds for comment and upvote highlighting

## Development

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- A modern web browser

### Setup
1. Clone the repository
2. Make your changes to the extension code
3. Load the unpacked extension as described in the Installation section
4. Reload the extension after changes using the refresh button on the extensions page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
