const fs = require("fs/promises");
const { getArrayFromJsonl } = require("./helpers-files");

async function findDuplicateWebsiteFields() {
  const humansMasterFile = "humansMaster.jsonl";
  const humansOutSuccess = "humansOutSuccess.jsonl";

  // Load humans data from humansMaster.jsonl
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  // Filter records that have both website and websites fields
  const recordsWithBothFields = humansArray.filter(
    (human) => human.website && human.websites
  );

  // Write the filtered records to the output file
  if (recordsWithBothFields.length > 0) {
    await fs.writeFile(
      humansOutSuccess,
      recordsWithBothFields.map((item) => JSON.stringify(item)).join("\n") +
        "\n",
      "utf8"
    );
  }

  console.log(`Total records processed: ${humansArray.length}`);
  console.log(
    `Records with both website and websites fields: ${recordsWithBothFields.length}`
  );
}

findDuplicateWebsiteFields().catch(console.error);
