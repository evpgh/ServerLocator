// Map continent codes to full names
const continentNames = {
  "NA": "North America",
  "SA": "South America",
  "EU": "Europe",
  "AS": "Asia",
  "AF": "Africa",
  "OC": "Oceania",
  // "AN": "Antarctica",
  "unknown": "Unknown"
};

// Map continent codes to icon filenames
const continentIcons = {
  "NA": "north_america.png",
  "SA": "south_america.png",
  "EU": "europe.png",
  "AS": "asia.png",
  "AF": "africa.png",
  "OC": "oceania.png",
  // "AN": "antarctica.png",
  "unknown": "globe32.png"
};

// Update popup with current site information
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await chrome.storage.local.get('currentSite');
    
    if (data.currentSite) {
      const { hostname, continent } = data.currentSite;
      
      // Update UI elements
      document.getElementById('hostname').textContent = hostname;
      document.getElementById('continent').textContent = continentNames[continent] || "Unknown";
      
      // Update icon
      const iconPath = continentIcons[continent] || continentIcons.unknown;
      document.getElementById('continentIcon').src = `icons/${iconPath}`;
    } else {
      document.getElementById('hostname').textContent = "No data available";
      document.getElementById('continent').textContent = "Try refreshing the page";
    }
  } catch (error) {
    console.error("Error loading popup data:", error);
    document.getElementById('hostname').textContent = "Error";
    document.getElementById('continent').textContent = "Please try again";
  }
});
