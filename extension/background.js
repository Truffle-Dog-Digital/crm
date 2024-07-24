var isProduction = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener(
  (scriptRequest, scriptSender, scriptResponse) => {
    console.log("Received script message", scriptRequest);

    if (scriptRequest.action === "updateIsProduction") {
      isProduction = scriptRequest.isProduction;
      console.log(
        "Production Switch is " +
          (isProduction ? "ON" : "OFF") +
          " in background script"
      );
      return;
    }
  }
);
