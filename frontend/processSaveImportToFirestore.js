import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const processSaveImportToFirestore = async (
  file,
  user,
  setLoading,
  setSummary,
  handleCloseMenu
) => {
  if (!file) {
    console.log("No file selected");
    return;
  }

  setLoading(true);
  console.log("Loading file...");
  try {
    const text = await file.text();
    const rows = text.split("\n").filter((row) => row.trim() !== "");

    if (rows[0].split(",").length === 4) {
      console.log("Detected CBA Transaction format");
      const transactions = rows.map((row) => {
        const [dateStr, amountStr, description, extendedDescription] = row
          .split(",")
          .map((cell) => cell.trim());
        const [day, month, year] = dateStr.split("/");
        const date = `${year}-${month}-${day}`;
        const amount = parseFloat(amountStr.replace(/"/g, ""));
        const type = amount > 0 ? "DR" : "CR";
        return {
          account: "JNT",
          date,
          type,
          amount: Math.abs(amount).toFixed(2),
          description,
          extendedDescription: description, // For now, extendedDescription is same as description
        };
      });

      const startTime = Date.now();
      for (const transaction of transactions) {
        await addDoc(
          collection(db, "users", user.uid, "transactions"),
          transaction
        );
        console.log("Added transaction:", transaction);
      }
      const endTime = Date.now();
      console.log(
        `Added ${transactions.length} transactions in ${endTime - startTime} ms`
      );

      const dates = transactions.map((t) => new Date(t.date));
      const startDate = new Date(Math.min(...dates));
      const endDate = new Date(Math.max(...dates));
      setSummary({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        rowCount: transactions.length,
      });

      console.log("File loaded successfully and data added to Firestore");
    } else {
      console.error("File format not recognized");
    }
  } catch (error) {
    console.error("Error reading file: ", error);
  } finally {
    console.log("Setting loading to false and closing menu");
    setLoading(false);
    handleCloseMenu();
  }
};
