// Global variable to store the state of the production switch
var isProduction = false;

function injectDrawer() {
  injectHTMLAndCSS("drawer.html", "drawer.css", "body")
    .then(() => {
      setupDrawerCloseButton();
      setupProductionSwitch(); // Set up the event listener for the switch after the drawer is injected
      document.body.classList.add("reabilityDrawerOpen"); // Adjust body margin when drawer is injected
    })
    .catch((error) => console.error(error));
}

function setupProductionSwitch() {
  const productionSwitch = document.getElementById("productionSwitch");

  if (productionSwitch) {
    // Add event listener for state changes
    productionSwitch.addEventListener("change", function () {
      isProduction = this.checked;
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
