# Continent Detector Chrome Extension

This Chrome extension shows the continent of the server for the website you're currently visiting.

## Features

- Displays an icon representing the continent where the website's server is located
- Shows detailed information in a popup
- Caches results for better performance

## Setup

1. Clone this repository
2. Install dependencies: `bun install`
3. Build the extension: `bun run build`
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Continent Icons

You'll need to add continent icons to the `src/icons` directory:
- north_america.png
- south_america.png
- europe.png
- asia.png
- africa.png
- oceania.png
- globe.png (default icon)

Each icon should be available in 16x16, 48x48, and 128x128 sizes.
