import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { addHumans } from "../services/addHumans";

const PasteHandler = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handlePasteEvent = async (event) => {
      try {
        if (!user) {
          console.log("User not logged in, doing nothing");
          return;
        }

        const text = await navigator.clipboard.readText();
        const lines = text.split("\n").filter((line) => line.trim() !== "");

        const entries = lines.map((line) => JSON.parse(line));
        const allProperties = new Set();

        entries.forEach((entry) => {
          Object.keys(entry).forEach((key) => allProperties.add(key));
        });

        console.log("Properties found:", Array.from(allProperties));
        console.log("Total number of entries:", entries.length);

        await addHumans(user.uid, entries);
      } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
      }
    };

    window.addEventListener("paste", handlePasteEvent);

    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [user]);

  return null;
};

export default PasteHandler;
