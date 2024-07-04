import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function UploadArea({
  user,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragging,
  loading,
}) {
  return (
    <Box
      className={`upload-container ${dragging ? "dragging" : ""}`}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
    >
      {user ? (
        <>
          Drop a JSON file here, load from it the menu or just paste JSONL from
          the clipboard.
          {loading && (
            <Box className="upload-overlay">
              <CircularProgress />
            </Box>
          )}
        </>
      ) : (
        <Typography>Sign in to get started</Typography>
      )}
    </Box>
  );
}

export default UploadArea;
