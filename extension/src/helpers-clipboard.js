// Function to copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("REABILITY: Text copied to clipboard");
  } catch (error) {
    console.error("REABILITY: Error copying text to clipboard", error);
  }
}

// Function to clear the clipboard
export async function clearClipboard() {
  try {
    await navigator.clipboard.writeText("");
    console.log("REABILITY: Clipboard cleared");
  } catch (error) {
    console.error("REABILITY: Error clearing the clipboard", error);
  }
}
