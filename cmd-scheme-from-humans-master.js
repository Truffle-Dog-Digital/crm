const fs = require("fs/promises");

async function analyzeSchema() {
  // First, let's read and parse the file
  const fileContent = await fs.readFile("humansMaster.jsonl", {
    encoding: "utf8",
  });

  // ... rest of your existing code ...
}

// Call the async function
analyzeSchema().catch(console.error);
