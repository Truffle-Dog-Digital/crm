import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
import { saveImportToFirestore } from "./saveImportToFirestore";

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("Auth state changed, user:", user);
    });

    return () => unsubscribe();
  }, []);

  const handleImport = async () => {
    setLoading(true);
    await saveImportToFirestore(fileObjects, user, setLoading, setSummary, () =>
      setMenuAnchorEl(null)
    );
    setLoading(false);
    setSummary(null); // Close the summary dialog
  };

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
        handleFileChange={(
          e,
          user,
          setLoading,
          setSummary,
          handleCloseMenu
        ) => {
          handleFileChange(
            e,
            user,
            setLoading,
            setSummary,
            handleCloseMenu,
            setFileObjects
          );
        }}
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
            handleFileChange(
              e,
              user,
              setLoading,
              setSummary,
              () => handleCloseMenu(setMenuAnchorEl),
              setFileObjects
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
          <DialogTitle>
            {summary.error ? "Error" : "Import Summary"}
          </DialogTitle>
          <DialogContent>
            {summary.error ? (
              <Typography>{summary.error}</Typography>
            ) : (
              <>
                <Typography>Total Objects: {summary.totalObjects}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSummary(null)}>Cancel</Button>
            <Button onClick={handleImport} color="primary">
              Import
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {loading && (
        <Dialog open={true}>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default App;
