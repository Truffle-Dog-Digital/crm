import { injectHTMLAndCSS, waitForXPath } from "./helpers-dom.js";
import {
  copyToClipboard,
  clearClipboard,
  setupClipboardListener,
} from "./helpers-clipboard.js";
import {
  injectDrawer,
  setupProductionSwitch,
  setupDrawerCloseButton,
} from "./drawer.js";

// Global variable to store the state of the production switch
var isProduction = false;

console.log("REABILITY: Linkedin Update Connected: 03");

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

    const uniqueHrefs = new Set();

    for (const node of nodes) {
      if (node.href) {
        uniqueHrefs.add(node.href);
      }
    }

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

injectHTMLAndCSS(
  "linkedin-update-connected.html",
  null,
  "#reabilityDrawerContent"
)
  .then(() => {
    setupClipboardListener(handleClipboardCopy);
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Linkedin HTML and CSS:", error);
  });
