const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");
const path = require("path");
const { stringify } = require("csv-stringify/sync");
// Known sequence of keys based on reorderProfileDetails function
const knownKeys = [
  "name",
  "profileId",
  "oldProfileId",
  "firstContact",
  "linkedinDistance",
  "pendingConnectionRequest",
  "requestLastSent",
  "audit",
  "roles",
  "linkedinConnected",
  "website",
  "email",
  // Add more keys as needed
];

async function main() {
  const humansMasterFile = "humansMaster.jsonl";
  const outputCsvFile = "humansMaster.csv";

  // Load humans data from humansMaster.jsonl
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  // Convert JSONL data to CSV-compatible format
  const csvData = humansArray.map((human) => {
    const csvRow = {};

    knownKeys.forEach((key) => {
      const value = human[key];

      if (Array.isArray(value)) {
        // Handle arrays: output multi-line with key: value pairs
        csvRow[key] = value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return Object.entries(item)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n");
            }
            return item;
          })
          .join("\n");
      } else if (typeof value === "object" && value !== null) {
        // Handle objects as key: value pairs
        csvRow[key] = Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
      } else {
        // Handle normal values
        csvRow[key] = value || "";
      }
    });

    return csvRow;
  });

  // Generate CSV output
  const csvOutput = stringify(csvData, {
    header: true,
    columns: knownKeys,
    quoted_string: true, // Ensures multi-line content is properly wrapped
  });

  // Write to output file
  fs.writeFileSync(outputCsvFile, csvOutput, "utf8");

  console.log(`CSV generated successfully: ${path.resolve(outputCsvFile)}`);
}

main();
