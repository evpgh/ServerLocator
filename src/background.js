import countryToContinent from './countryToContinent.js';
import continentIcons from './continentIcons.js';

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    console.error("Invalid URL:", url);
    return null;
  }
}

function ipv4ToDecimal(ip) {
  const parts = ip.split(".");
  return parseInt(parts[0]) * Math.pow(256, 3) + parseInt(parts[1]) * Math.pow(256, 2) + parseInt(parts[2]) * 256 + parseInt(parts[3]);
}

async function resolveHostname(hostname) {
  console.log("Asking DNS Google for: " + hostname);
  let response = await fetch(`https://dns.google/resolve?name=${hostname}`);
  if(!response.ok) throw new Error("Failed to resolve hostname: " + hostname);
  
  let data = await response.json();
  if (!data.Answer || !data.Answer.length) { throw new Error("Failed to resolve hostname: " + hostname)}

  // Find the first A record (IP address)
  for (let record of data.Answer) {
      if (record.type === 1) { // Type 1 = A record (IPv4)
          console.log("Google DNS resolved IP: " + record.data);
          return record.data;
      }
  }

  // If no A record is found, check for CNAME and resolve it
  let cnameRecord = data.Answer.find(record => record.type === 5); // Type 5 = CNAME
  if (cnameRecord) {
      console.log(`CNAME found: ${cnameRecord.data}, resolving further...`);
      return resolveHostname(cnameRecord.data); // Recursively resolve the CNAME
  }

  throw new Error("No A record or resolvable CNAME found.");
}

async function getContinentAndCountryFromHostname(hostname) {
  try {
    const cached = await chrome.storage.local.get(hostname);
    if (cached[hostname] && cached[hostname].continent !== null && cached[hostname].country !== null) {
      console.log("Hostname cached: " + hostname)
      return cached[hostname];
    }
    const ip = await resolveHostname(hostname);
    const decimalIp = ipv4ToDecimal(ip);
    console.log("IP2C Request IP: " + decimalIp);
    const geoResponse = await fetch(`https://ip2c.org/?dec=${decimalIp}`);
    const geoData = await geoResponse.text();
    const parts = geoData.split(";");
    console.log("IP2C response: " + parts);
    if (parts.length > 1) {
      console.log(parts);
      const countryCode = parts[1].slice(0,2);
      const continentCode = getContinentFromCountryCode(countryCode);
      const countryName = parts[3];
      chrome.storage.local.set({ [hostname]: { continent: continentCode, country: countryName } });
      return { continent: continentCode, country: countryName };
    } else {
      throw new Error("Failed to parse geolocation data");
    }
  } catch (error) {
    console.error("Error getting continent and country:", error);
    return { continent: "unknown", country: "unknown" };
  }
}

function getContinentFromCountryCode(countryCode) {
  console.log("Country Code:" + countryCode);
  
  return countryToContinent[countryCode] || "unknown";
}
async function updateIcon(tabId, url) {
  if (!url || !url.startsWith("http"))
    return;
  const hostname = getHostname(url);
  if (!hostname)
    return;
  const { continent, country } = await getContinentAndCountryFromHostname(hostname);
  console.log("Continent: " + continent);
  console.log("Country: " + country);
  const iconPath = continentIcons[continent] || "unknown";
  chrome.action.setIcon({
    tabId,
    path: {
      16: `icons/${iconPath}16.png`,
      48: `icons/${iconPath}48.png`,
      128: `icons/${iconPath}128.png`
    }
  });
  chrome.action.setTitle({
    tabId,
    title: `Server continent: ${continent}, country: ${country}`
  });
  chrome.storage.local.set({
    currentSite: {
      hostname,
      continent,
      country
    }
  });
}
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateIcon(activeInfo.tabId, tab.url);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    updateIcon(tabId, tab.url);
  }
});
