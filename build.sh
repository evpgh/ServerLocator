#!/bin/bash
# Install dependencies
bun install

# Build extension
bun run build

echo "Extension built successfully in the dist/ directory"
echo "To load in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click Load unpacked and select the dist/ folder"
