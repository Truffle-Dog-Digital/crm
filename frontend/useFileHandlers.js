import { useState } from "react";
import { checkImport } from "./checkImport";
import useDragAndDrop from "./useDragAndDrop";

const useFileHandlers = (user, setLoading, setSummary) => {
  const [fileObjects, setFileObjects] = useState([]);

  const handleFileChange = async (event, handleCloseMenu) => {
    const file = event.target.files
      ? event.target.files[0]
      : event.dataTransfer.files[0];

    try {
      const text = await file.text();
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
      console.error("Error reading file: ", error);
      setSummary({ error: "Error reading file" });
    }

    if (handleCloseMenu) handleCloseMenu();
  };

  const { dragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(handleFileChange, setFileObjects, setSummary);

  return {
    fileObjects,
    dragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useFileHandlers;
