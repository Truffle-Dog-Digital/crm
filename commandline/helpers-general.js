// Helper function to get today's date in ISO format for a specified timezone
function getTodayISODate() {
  const options = {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Get the date in "DD/MM/YYYY" format and convert it to "YYYY-MM-DD"
  const dateString = new Date().toLocaleDateString("en-CA", options);
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
}

function timeStamp() {
  const now = new Date();
  return `[${now.toTimeString().split(" ")[0]}]`; // Returns "[hh:mm:ss]"
}

module.exports = {
  getTodayISODate,
  timeStamp,
};
