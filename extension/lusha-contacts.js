function setupGrabButton() {
  const grabButton = document.getElementById("reabilityLushaListGrab");
  if (grabButton) {
    grabButton.addEventListener("click", handleLushaListGrabClick);
  }
}

function setupClearButton() {
  const clearButton = document.getElementById("clearProfiles");
  if (clearButton) {
    clearButton.addEventListener("click", handleClearProfilesClick);
  }
}

// Function to handle Grab Contacts button click
async function handleLushaListGrabClick() {
  console.log("REABILITY: Grab Contacts button clicked");
  const linkedinUrls = await getLushaContacts();
  console.log("REABILITY: Found LinkedIn URLs", linkedinUrls);
  await appendLinkedInUrlsToStorage(linkedinUrls);
  const allUrls = await getLocalStorage("REABILITY_PROFILES");
  console.log("REABILITY: All LinkedIn URLs in storage", allUrls);
  const lineDelimitedUrls = allUrls.join("\n");
  await copyToClipboard(lineDelimitedUrls);
  console.log("REABILITY: Line delimited URLs", lineDelimitedUrls);
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

// Function to append LinkedIn URLs to local storage
async function appendLinkedInUrlsToStorage(newUrls) {
  const existingUrls = (await getLocalStorage("REABILITY_PROFILES")) || [];
  const updatedUrls = [...existingUrls, ...newUrls];
  await setLocalStorage("REABILITY_PROFILES", updatedUrls);
}

// Function to handle Clear Profiles button click
async function handleClearProfilesClick() {
  console.log("REABILITY: Clear Profiles button clicked");
  await clearLinkedInUrlsFromStorage();
  await clearClipboard();
}

// Function to clear LinkedIn URLs from local storage
async function clearLinkedInUrlsFromStorage() {
  try {
    await setLocalStorage("REABILITY_PROFILES", []);
    console.log("REABILITY: LinkedIn URLs cleared from storage");
  } catch (error) {
    console.error(
      "REABILITY: Error clearing LinkedIn URLs from storage",
      error
    );
  }
}

// Function to clear the clipboard
async function clearClipboard() {
  try {
    await navigator.clipboard.writeText("");
    console.log("REABILITY: Clipboard cleared");
  } catch (error) {
    console.error("REABILITY: Error clearing the clipboard", error);
  }
}

// Function to copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("REABILITY: Text copied to clipboard");
  } catch (error) {
    console.error("REABILITY: Error copying text to clipboard", error);
  }
}

// Initialize and inject the HTML and CSS
injectHTMLAndCSS(
  "lusha-contacts.html",
  "lusha-contacts.css",
  "#reabilityDrawerContent"
)
  .then(() => {
    setupGrabButton();
    setupClearButton();
  })
  .catch((error) => {
    console.error(
      "REABILITY: Error injecting Lusha Contacts HTML and CSS:",
      error
    );
  });
