import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { auth } from "./firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  handleSignIn,
  handleSignOut,
  handleOpenUserMenu,
  handleCloseUserMenu,
  handleOpenMenu,
  handleCloseMenu,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} from "./eventHandlers";
import ToolbarComponent from "./Toolbar";
import "./App.css";
import Box from "@mui/material/Box"; // Make sure this is last, otherwise it breaks the default theme somehow

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("Auth state changed, user:", user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <ToolbarComponent
        user={user}
        anchorEl={anchorEl}
        menuAnchorEl={menuAnchorEl}
        handleOpenMenu={handleOpenMenu}
        handleCloseMenu={handleCloseMenu}
        handleOpenUserMenu={handleOpenUserMenu}
        handleCloseUserMenu={handleCloseUserMenu}
        handleSignOut={handleSignOut}
        handleSignIn={handleSignIn}
        handleFileChange={handleFileChange}
        setMenuAnchorEl={setMenuAnchorEl}
        setAnchorEl={setAnchorEl}
        auth={auth}
        setLoading={setLoading}
        setSummary={setSummary}
      />
      <Box
        className={`upload-container ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => handleDragOver(e, setDragging)}
        onDragLeave={() => handleDragLeave(setDragging)}
        onDrop={(e) =>
          handleDrop(e, setDragging, (e) =>
            handleFileChange(e, user, setLoading, setSummary, () =>
              handleCloseMenu(setMenuAnchorEl)
            )
          )
        }
      >
        {user ? (
          <>
            Drop a JSON file here, load from it the menu or just paste JSONL
            from the clipboard.
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
    </div>
  );
}

export default App;
