const fs = require("fs").promises;

async function linkedinCleanCookies(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    let cookies = JSON.parse(data);

    cookies = cookies.map((cookie) => {
      if (cookie.sameSite === null) {
        cookie.sameSite = "None";
      } else if (cookie.sameSite.toLowerCase() === "lax") {
        cookie.sameSite = "Lax";
      } else if (cookie.sameSite.toLowerCase() === "no_restriction") {
        cookie.sameSite = "None";
      }
      return cookie;
    });

    return cookies;
  } catch (error) {
    console.error("Error reading or cleaning cookies:", error);
    throw error;
  }
}

module.exports = linkedinCleanCookies;
