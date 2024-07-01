// src/components/CSVLoader.jsx
import React, { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

const CSVLoader = ({ menuAnchorEl, handleCloseMenu }) => {
  const [summary, setSummary] = useState(null);

  const handleFileChange = async (file) => {
    if (file) {
      try {
        const text = await file.text();
        const rows = text.split("\n").filter((row) => row.trim() !== "");
        const dates = rows.map((row) => {
          const dateStr = row.split(",")[0].trim();
          const [day, month, year] = dateStr.split("/");
          return new Date(`${year}-${month}-${day}`);
        });
        const startDate = new Date(Math.min(...dates));
        const endDate = new Date(Math.max(...dates));
        setSummary({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          rowCount: rows.length,
        });
      } catch (error) {
        console.error("Error reading file: ", error);
      } finally {
        handleCloseMenu();
      }
    }
  };

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      handleFileChange(file);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  return (
    <>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem>
          <label
            htmlFor="upload-csv"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <UploadFileIcon />
            Load CSV
            <input
              id="upload-csv"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </label>
        </MenuItem>
      </Menu>
      {summary && (
        <Dialog open={Boolean(summary)} onClose={() => setSummary(null)}>
          <DialogTitle>CSV Loaded</DialogTitle>
          <DialogContent>
            <Typography>Start Date: {summary.startDate}</Typography>
            <Typography>End Date: {summary.endDate}</Typography>
            <Typography>Number of Rows: {summary.rowCount}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CSVLoader;
