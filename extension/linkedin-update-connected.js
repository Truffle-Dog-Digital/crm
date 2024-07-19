function setupUpdateConnectedButton() {
  const button = document.getElementById("reabilityUpdateConnected");
  if (button) {
    button.addEventListener("click", handleUpdateConnectedButtonClick);
  }
}

async function handleUpdateConnectedButtonClick() {
  console.log("REABILITY: Update Connected button clicked");

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

    // Create the JSON array
    const jsonArray = Array.from(uniqueHrefs).map(
      (href) => `https://linkedin.com${new URL(href).pathname}`
    );

    // Output the JSON array
    const jsonString = JSON.stringify(jsonArray, null, 2);
    console.log(jsonString);
    return jsonString;
  } catch (error) {
    console.error("Error finding profiles:", error);
  }
}

injectHTMLAndCSS("linkedin.html", null, "#reabilityDrawerContent")
  .then(() => {
    setupUpdateConnectedButton();
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Linkedin HTML and CSS:", error);
  });
