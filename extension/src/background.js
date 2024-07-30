let isProduction = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log("REABILITY: Extension installed");
});

chrome.runtime.onMessage.addListener(
  (scriptRequest, scriptSender, scriptResponse) => {
    console.log("REABILITY: Received script message", scriptRequest);

    if (scriptRequest.action === "updateIsProduction") {
      isProduction = scriptRequest.isProduction;
      console.log(
        "REABILITY: Production switch is " + (isProduction ? "ON" : "OFF")
      );
      return;
    }
  }
);
