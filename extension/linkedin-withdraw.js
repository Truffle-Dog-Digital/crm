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
      console.log("No more withdrawal buttons found, stopping.");
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

injectHTMLAndCSS("linkedin.html", null, "#reabilityDrawerContent")
  .then(() => {
    setupWithdrawButton();
  })
  .catch((error) => {
    console.error("REABILITY: Error setting up Linkedin HTML and CSS:", error);
  });
