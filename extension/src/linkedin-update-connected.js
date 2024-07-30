import { injectHTMLAndCSS, waitForXPath } from "./helpers-dom.js";
import { copyToClipboard, clearClipboard } from "./helpers-clipboard.js";
import {
  injectDrawer,
  setupProductionSwitch,
  setupDrawerCloseButton,
} from "./drawer.js";

// Global variable to store the state of the production switch
var isProduction = false;

console.log("REABILITY: Linkedin Update Connected: 03");

function setupClipboardListener() {
  document.addEventListener("copy", handleClipboardCopy);
}

// Function to handle clipboard copy event
async function handleClipboardCopy(event) {
  console.log("REABILITY: Clipboard copy detected");
  const linkedinUrls = await getLinkedinConnections();
  const lineDelimitedUrls = linkedinUrls.join("\n");
  if (linkedinUrls.length > 0) {
    await copyToClipboard(lineDelimitedUrls);
    console.log(
      "REABILITY: Line delimited URLs copied to clipboard",
      lineDelimitedUrls
    );
  } else {
    await clearClipboard();
    console.log("REABILITY: No connections found, clipboard cleared");
  }
}

async function getLinkedinConnections() {
  console.log("REABILITY: Getting LinkedIn connections");

  try {
    const nodes = await waitForXPath(
      "//section[contains(@class, 'mn-connections')]//li//a",
      3000
    );

    // Create a Set to store unique hrefs
    const uniqueHrefs = new Set();

    // Iterate over the nodes and extract hrefs
    for (const node of nodes) {
      if (node.href) {
        uniqueHrefs.add(node.href);
      }
    }

    // Convert the Set to an array of plain URLs
    const urlsArray = Array.from(uniqueHrefs).map(
      (href) => `https://linkedin.com${new URL(href).pathname}`
    );

    return urlsArray;
  } catch (error) {
    console.error("Error finding profiles:", error);
    return [];
  }
}

injectDrawer();
setupProductionSwitch();
setupDrawerCloseButton();

// Initialize and inject the HTML and CSS, and setup clipboard listener
injectHTMLAndCSS(
  "linkedin-update-connected.html",
  null,
  "#reabilityDrawerContent"
)
  .then(() => {
    setupClipboardListener();
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Linkedin HTML and CSS:", error);
  });
