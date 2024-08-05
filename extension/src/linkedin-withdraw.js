import { injectHTMLAndCSS, waitForXPath } from "./helpers-dom.js";
import {
  injectDrawer,
  setupProductionSwitch,
  setupDrawerCloseButton,
} from "./drawer.js";
import {
  copyToClipboard,
  clearClipboard,
  setupClipboardListener,
} from "./helpers-clipboard.js";

// Global variable to store the state of the production switch
var isProduction = false;

function setupWithdrawButton() {
  const button = document.getElementById("reabilityLinkedinWithdraw");
  if (button) {
    button.addEventListener("click", handleWithdrawButtonClick);
  }
}

async function handleWithdrawButtonClick() {
  console.log("REABILITY: Withdraw button clicked");

  while (true) {
    const buttons = await waitForXPath(
      "//div[contains(@class, 'invitation-card__container')][.//span[contains(@class, 'time-badge') and contains(., 'month')]]//button[span[text()='Withdraw']]",
      3000
    );

    if (!buttons || buttons.length === 0) {
      console.log("REABILITY: No more withdrawal buttons found, stopping.");
      break;
    }

    buttons[0].click();

    const withdrawDialogButton = await waitForXPath(
      "//div[@data-test-modal and @role='alertdialog']//span[text()='Withdraw']",
      3000
    );

    if (withdrawDialogButton && withdrawDialogButton.length > 0) {
      withdrawDialogButton[0].click();
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before the next iteration
  }
}

// Function to handle clipboard copy event
async function handleClipboardCopy(event) {
  console.log("REABILITY: Clipboard copy detected");
  const linkedinUrls = await getLinkedinInvitationCardPictures();
  const lineDelimitedUrls = linkedinUrls.join("\n");
  if (linkedinUrls.length > 0) {
    await copyToClipboard(lineDelimitedUrls);
    console.log(
      "REABILITY: Line delimited URLs copied to clipboard",
      lineDelimitedUrls
    );
  } else {
    await clearClipboard();
    console.log(
      "REABILITY: No invitation card pictures found, clipboard cleared"
    );
  }
}

// Function to get LinkedIn invitation card pictures
async function getLinkedinInvitationCardPictures() {
  console.log("REABILITY: Getting LinkedIn invitation card pictures");

  try {
    const nodes = await waitForXPath(
      "//a[contains(@class, 'invitation-card__picture')]/@href",
      3000
    );

    const uniqueHrefs = new Set();

    for (const node of nodes) {
      if (node.value) {
        uniqueHrefs.add(node.value);
      }
    }

    const urlsArray = Array.from(uniqueHrefs).map(
      (href) => `https://linkedin.com${new URL(href).pathname}`
    );

    return urlsArray;
  } catch (error) {
    console.error("Error finding invitation card pictures:", error);
    return [];
  }
}

// Inject the drawer HTML and CSS, and setup drawer functionality
injectDrawer();
setupProductionSwitch();
setupDrawerCloseButton();

// Initialize and inject the HTML and CSS, and setup buttons
injectHTMLAndCSS("linkedin-withdraw.html", null, "#reabilityDrawerContent")
  .then(() => {
    setupWithdrawButton();
    setupClipboardListener(handleClipboardCopy);
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Linkedin HTML and CSS:", error);
  });
