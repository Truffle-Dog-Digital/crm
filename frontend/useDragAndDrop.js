import { useState, useEffect } from "react";
import { checkImport } from "./checkImport";

const useDragAndDrop = (handleFileChange, setFileObjects, setSummary) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
    console.log("Dragging over");
  };

  const handleDragLeave = () => {
    setDragging(false);
    console.log("Drag leave");
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);
    console.log("File dropped");
    await handleFileChange(event);
  };

  const handlePaste = async (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    try {
      const rows = text.split("\n").filter((row) => row.trim() !== "");
      const objects = rows.map((row) => JSON.parse(row));
      setFileObjects(objects);

      const checkResult = await checkImport(objects);
      if (checkResult.error) {
        setSummary({ error: checkResult.error });
      } else {
        setSummary({
          totalObjects: checkResult.totalObjects,
        });
      }
    } catch (error) {
      console.error("Error processing clipboard content: ", error);
      setSummary({ error: "Error processing clipboard content" });
    }
  };

  useEffect(() => {
    const handlePasteEvent = (e) => {
      handlePaste(e);
    };

    window.addEventListener("paste", handlePasteEvent);

    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [handlePaste]);

  return {
    dragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useDragAndDrop;