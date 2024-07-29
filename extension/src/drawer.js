import { injectHTMLAndCSS } from "./helpers-dom.js";

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
      chrome.runtime.sendMessage({
        action: "updateIsProduction",
        isProduction: this.checked,
      });
      console.log(
        "REABILITY: Production switch is " + (this.checked ? "ON" : "OFF")
      );
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
        document.body.classList.remove("reabilityDrawerOpen");
      }
    });
  }
}

export { injectDrawer, setupProductionSwitch, setupDrawerCloseButton };
