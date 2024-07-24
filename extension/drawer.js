// Global variable to store the state of the production switch
var isProduction = false;

function injectDrawer() {
  injectHTMLAndCSS("drawer.html", "drawer.css", "body")
    .then(() => {
      setupDrawerCloseButton();
      setupProductionSwitch();
      document.body.classList.add("reabilityDrawerOpen");
    })
    .catch((error) => console.error(error));
}

function setupProductionSwitch() {
  const productionSwitch = document.getElementById("productionSwitch");

  if (productionSwitch) {
    productionSwitch.addEventListener("change", function () {
      // Update the global variable and send same state to the background script
      isProduction = this.checked;
      chrome.runtime.sendMessage({
        action: "updateIsProduction",
        isProduction: isProduction,
      });
      console.log("Production Switch is " + (isProduction ? "ON" : "OFF"));
    });
  }
}

function setupDrawerCloseButton() {
  const closeButton = document.getElementById("reabilityDrawerCloseButton");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const drawer = document.getElementById("reabilityDrawer");
      if (drawer) {
        drawer.style.display = "none";
        document.body.classList.remove("reabilityDrawerOpen"); // Remove body margin adjustment when drawer is closed
      }
    });
  }
}

injectDrawer();
