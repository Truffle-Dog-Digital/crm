import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const PasteHandler = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handlePasteEvent = async (event) => {
      try {
        const text = await navigator.clipboard.readText();
        console.log("Paste from clipboard registered");
      } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
      }
    };

    window.addEventListener("paste", handlePasteEvent);

    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [user]);

  return null; // This component does not render anything
};

export default PasteHandler;
