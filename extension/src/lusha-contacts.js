import { injectHTMLAndCSS } from "./helpers-dom.js";
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

console.log("REABILITY: Lusha Contacts: 01");

// Function to handle clipboard copy event
async function handleClipboardCopy(event) {
  console.log("REABILITY: Clipboard copy detected");
  const linkedinUrls = await getLushaContacts();
  console.log("REABILITY: Found LinkedIn URLs", linkedinUrls);
  const lineDelimitedUrls = linkedinUrls.join("\n");
  if (linkedinUrls.length > 0) {
    await copyToClipboard(lineDelimitedUrls);
    console.log(
      "REABILITY: Line delimited URLs copied to clipboard",
      lineDelimitedUrls
    );
  } else {
    await clearClipboard();
    console.log("REABILITY: No contacts found, clipboard cleared");
  }
}

// Function to get selected Lusha contacts
async function getLushaContacts() {
  const contacts = document.querySelectorAll(
    "[data-test-id^='contacts-table-contact-name-']"
  );
  const linkedinUrls = [];

  contacts.forEach((contact) => {
    const checkbox = contact.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const linkedinUrl = contact.querySelector('a[href*="linkedin.com"]');
      if (linkedinUrl) {
        linkedinUrls.push(linkedinUrl.href);
      }
    }
  });

  return linkedinUrls;
}

injectDrawer();
setupProductionSwitch();
setupDrawerCloseButton();

injectHTMLAndCSS("lusha-contacts.html", null, "#reabilityDrawerContent")
  .then(() => {
    setupClipboardListener(handleClipboardCopy);
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Lusha HTML and CSS:", error);
  });
