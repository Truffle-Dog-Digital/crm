function injectDrawer() {
  injectHTMLAndCSS("drawer.html", "drawer.css", "body")
    .then(() => {
      setupDrawerCloseButton();
      document.body.classList.add("reabilityDrawerOpen"); // Adjust body margin when drawer is injected
    })
    .catch((error) => console.error(error));
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
