// src/background.js
var continentIcons = {
  NA: "north_america32.png",
  SA: "south_america32.png",
  EU: "europe32.png",
  AS: "asia32.png",
  AF: "africa32.png",
  OC: "oceania32.png",
  unknown: "globe32.png"
};
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
  let data = await response.json();

  if (!data.Answer || !data.Answer.length) {
      throw new Error("Failed to resolve hostname");
  }

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
async function getContinentFromHostname(hostname) {
  try {
    const cached = await chrome.storage.local.get(hostname);
    if (cached[hostname] && cached[hostname] !== null) {
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
      const continentCode = getContinentFromCountryCode(parts[1].slice(0,2));
      chrome.storage.local.set({ [hostname]: continentCode });
      return continentCode;
    } else {
      throw new Error("Failed to parse geolocation data");
    }
  } catch (error) {
    console.error("Error getting continent:", error);
    return "unknown";
  }
}
function getContinentFromCountryCode(countryCode) {
  console.log("Country Code:" + countryCode);
  const countryToContinent = {
    AD: "EU",
    AE: "AS",
    AF: "AS",
    AG: "NA",
    AI: "NA",
    AL: "EU",
    AM: "AS",
    AO: "AF",
    AQ: "AN",
    AR: "SA",
    AS: "OC",
    AT: "EU",
    AU: "OC",
    AW: "NA",
    AX: "EU",
    AZ: "AS",
    BA: "EU",
    BB: "NA",
    BD: "AS",
    BE: "EU",
    BF: "AF",
    BG: "EU",
    BH: "AS",
    BI: "AF",
    BJ: "AF",
    BL: "NA",
    BM: "NA",
    BN: "AS",
    BO: "SA",
    BQ: "NA",
    BR: "SA",
    BS: "NA",
    BT: "AS",
    BV: "AN",
    BW: "AF",
    BY: "EU",
    BZ: "NA",
    CA: "NA",
    CC: "OC",
    CD: "AF",
    CF: "AF",
    CG: "AF",
    CH: "EU",
    CI: "AF",
    CK: "OC",
    CL: "SA",
    CM: "AF",
    CN: "AS",
    CO: "SA",
    CR: "NA",
    CU: "NA",
    CV: "AF",
    CW: "NA",
    CX: "OC",
    CY: "AS",
    CZ: "EU",
    DE: "EU",
    DJ: "AF",
    DK: "EU",
    DM: "NA",
    DO: "NA",
    DZ: "AF",
    EC: "SA",
    EE: "EU",
    EG: "AF",
    EH: "AF",
    ER: "AF",
    ES: "EU",
    ET: "AF",
    FI: "EU",
    FJ: "OC",
    FK: "SA",
    FM: "OC",
    FO: "EU",
    FR: "EU",
    GA: "AF",
    GB: "EU",
    GD: "NA",
    GE: "AS",
    GF: "SA",
    GG: "EU",
    GH: "AF",
    GI: "EU",
    GL: "NA",
    GM: "AF",
    GN: "AF",
    GP: "NA",
    GQ: "AF",
    GR: "EU",
    GS: "AN",
    GT: "NA",
    GU: "OC",
    GW: "AF",
    GY: "SA",
    HK: "AS",
    HM: "AN",
    HN: "NA",
    HR: "EU",
    HT: "NA",
    HU: "EU",
    ID: "AS",
    IE: "EU",
    IL: "AS",
    IM: "EU",
    IN: "AS",
    IO: "AS",
    IQ: "AS",
    IR: "AS",
    IS: "EU",
    IT: "EU",
    JE: "EU",
    JM: "NA",
    JO: "AS",
    JP: "AS",
    KE: "AF",
    KG: "AS",
    KH: "AS",
    KI: "OC",
    KM: "AF",
    KN: "NA",
    KP: "AS",
    KR: "AS",
    KW: "AS",
    KY: "NA",
    KZ: "AS",
    LA: "AS",
    LB: "AS",
    LC: "NA",
    LI: "EU",
    LK: "AS",
    LR: "AF",
    LS: "AF",
    LT: "EU",
    LU: "EU",
    LV: "EU",
    LY: "AF",
    MA: "AF",
    MC: "EU",
    MD: "EU",
    ME: "EU",
    MF: "NA",
    MG: "AF",
    MH: "OC",
    MK: "EU",
    ML: "AF",
    MM: "AS",
    MN: "AS",
    MO: "AS",
    MP: "OC",
    MQ: "NA",
    MR: "AF",
    MS: "NA",
    MT: "EU",
    MU: "AF",
    MV: "AS",
    MW: "AF",
    MX: "NA",
    MY: "AS",
    MZ: "AF",
    NA: "AF",
    NC: "OC",
    NE: "AF",
    NF: "OC",
    NG: "AF",
    NI: "NA",
    NL: "EU",
    NO: "EU",
    NP: "AS",
    NR: "OC",
    NU: "OC",
    NZ: "OC",
    OM: "AS",
    PA: "NA",
    PE: "SA",
    PF: "OC",
    PG: "OC",
    PH: "AS",
    PK: "AS",
    PL: "EU",
    PM: "NA",
    PN: "OC",
    PR: "NA",
    PS: "AS",
    PT: "EU",
    PW: "OC",
    PY: "SA",
    QA: "AS",
    RE: "AF",
    RO: "EU",
    RS: "EU",
    RU: "EU",
    RW: "AF",
    SA: "AS",
    SB: "OC",
    SC: "AF",
    SD: "AF",
    SE: "EU",
    SG: "AS",
    SH: "AF",
    SI: "EU",
    SJ: "AN",
    SK: "EU",
    SL: "AF",
    SM: "EU",
    SN: "AF",
    SO: "AF",
    SR: "SA",
    SS: "AF",
    ST: "AF",
    SV: "NA",
    SX: "NA",
    SY: "AS",
    SZ: "AF",
    TC: "NA",
    TD: "AF",
    TF: "AN",
    TG: "AF",
    TH: "AS",
    TJ: "AS",
    TK: "OC",
    TL: "AS",
    TM: "AS",
    TN: "AF",
    TO: "OC",
    TR: "EU",
    TT: "NA",
    TV: "OC",
    TW: "AS",
    TZ: "AF",
    UA: "EU",
    UG: "AF",
    UM: "OC",
    US: "NA",
    UY: "SA",
    UZ: "AS",
    VA: "EU",
    VC: "NA",
    VE: "SA",
    VG: "NA",
    VI: "NA",
    VN: "AS",
    VU: "OC",
    WF: "OC",
    WS: "OC",
    XK: "EU",
    YE: "AS",
    YT: "AF",
    ZA: "AF",
    ZM: "AF",
    ZW: "AF"
};
  return countryToContinent[countryCode] || "unknown";
}
async function updateIcon(tabId, url) {
  if (!url || !url.startsWith("http"))
    return;
  const hostname = getHostname(url);
  if (!hostname)
    return;
  const continent = await getContinentFromHostname(hostname);
  console.log("Continent: " + continent);
  const iconPath = continentIcons[continent] || continentIcons.unknown;
  chrome.action.setIcon({
    tabId,
    path: {
      16: `icons/${iconPath}`,
      48: `icons/${iconPath}`,
      128: `icons/${iconPath}`
    }
  });
  chrome.action.setTitle({
    tabId,
    title: `Server location: ${continent}`
  });
  chrome.storage.local.set({
    currentSite: {
      hostname,
      continent
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
