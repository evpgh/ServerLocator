import continentIcons from './continentIcons.js';
import continentNames from './continentNames.js';

// Update popup with current site information
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await chrome.storage.local.get('currentSite');
    
    if (data.currentSite) {
      const { hostname, continent, country } = data.currentSite;
      
      // Update UI elements
      document.getElementById('hostname').textContent = hostname;
      document.getElementById('continent-country').textContent = `Continent: ${continentNames[continent] || "Unknown"}, Country: ${country}`;
      
      // Update icon
      const iconPath = continentIcons[continent] || continentIcons.unknown;
      document.getElementById('continentIcon').src = `icons/${iconPath}128.png`;
    } else {
      document.getElementById('hostname').textContent = "No data available";
      document.getElementById('continent-country').textContent = "Try refreshing the page";
    }
  } catch (error) {
    console.error("Error loading popup data:", error);
    document.getElementById('hostname').textContent = "Error";
    document.getElementById('continent-country').textContent = "Please try again";
  }
});