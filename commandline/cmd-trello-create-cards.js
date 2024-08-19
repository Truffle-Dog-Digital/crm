require("dotenv").config({ path: "../.env" }); // Load the .env file from one directory above
const axios = require("axios");
const fs = require("fs");
const csv = require("csv-parser");

// Load environment variables
const apiKey = process.env.TRELLO_API_KEY;
const apiToken = process.env.TRELLO_TOKEN;
const listId = process.env.TRELLO_LIST_ID;

// Function to extract the company from the roles field and scrub unwanted text
function extractCompany(roles) {
  if (!roles) return "";

  // Split the roles by line breaks
  const lines = roles.split("\n");

  // Find the line that starts with "company:"
  let companyLine = lines.find((line) =>
    line.toLowerCase().startsWith("company:")
  );

  // If found, remove the leading "company: " part and everything after " · "
  if (companyLine) {
    companyLine = companyLine.replace(/company:\s*/i, "").trim();
    companyLine = companyLine.split(" · ")[0].trim(); // Remove anything after and including " · "
    return companyLine;
  }

  return ""; // Return an empty string if no company is found
}

// Function to create a Trello card
async function createTrelloCard(
  name,
  company,
  profileUrl,
  roles,
  connectionDate
) {
  const cardTitle = `${name} - ${company}`;

  // Format the description
  const description = `
${profileUrl}

---

${roles}

---

Connected: ${connectionDate}
`.trim(); // Trim any extra spaces

  try {
    const response = await axios.post("https://api.trello.com/1/cards", {
      key: apiKey,
      token: apiToken,
      idList: listId,
      name: cardTitle, // Set the card title
      desc: description, // Set the card description
    });
    console.log(`Created card: ${cardTitle}`);
  } catch (error) {
    console.error(`Error creating card for ${cardTitle}:`, error.message);
  }
}

// Read the CSV file, sort by the linkedinConnected date, and create cards
fs.createReadStream("profilesInTrello.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Collect all rows
    row.linkedinConnectedDate = row.linkedinConnected; // Store date as an additional field for sorting
    data.push(row);
  })
  .on("end", async () => {
    // Sort data by the linkedinConnected field (oldest date first)
    data.sort(
      (a, b) =>
        new Date(a.linkedinConnectedDate) - new Date(b.linkedinConnectedDate)
    );

    // Create Trello cards in the sorted order
    for (const row of data) {
      const name = row.name;
      const roles = row.roles;
      const profileUrl = row.profileUrl;
      const connectionDate = row.linkedinConnected;

      // Extract the company from the roles field
      const company = extractCompany(roles);

      if (name && company) {
        await createTrelloCard(
          name,
          company,
          profileUrl,
          roles,
          connectionDate
        );
      }
    }

    console.log("All cards created in order by connection date.");
  });

let data = [];
