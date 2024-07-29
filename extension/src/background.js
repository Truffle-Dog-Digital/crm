let isProduction = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log("RExtension installed");
});

chrome.runtime.onMessage.addListener(
  (scriptRequest, scriptSender, scriptResponse) => {
    console.log("Received script message", scriptRequest);

    if (scriptRequest.action === "updateIsProduction") {
      isProduction = scriptRequest.isProduction;
      console.log(
        "Production switch is " +
          (isProduction ? "ON" : "OFF") +
          " in background script"
      );
      return;
    }
  }
);
