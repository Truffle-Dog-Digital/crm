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

// Convert "Aug 31, 2024" -> "2024-08-31"
function getISODateFrom(dateString) {
  const [month, day, year] = dateString.split(" ");
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return `${year}-${months[month]}-${day.replace(",", "").padStart(2, "0")}`;
}

module.exports = {
  getTodayISODate,
  timeStamp,
  getISODateFrom,
};
