import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { auth } from "./firebaseConfig";
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
  handlePaste,
} from "./eventHandlers";
import ToolbarComponent from "./Toolbar";
import UploadArea from "./UploadArea";
import "./App.css";
import { saveImportToFirestore } from "./saveImportToFirestore";
import useAuthState from "./useAuthState";

function App() {
  const user = useAuthState(); // Use the custom hook
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  useEffect(() => {
    const handlePasteEvent = (e) => {
      handlePaste(e, user, setLoading, setSummary, setFileObjects);
    };

    window.addEventListener("paste", handlePasteEvent);

    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [user]);

  const handleImport = async () => {
    setLoading(true);
    await saveImportToFirestore(fileObjects, user, setLoading, setSummary, () =>
      setMenuAnchorEl(null)
    );
    setLoading(false);
    setSummary(null);
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
      <UploadArea
        user={user}
        handleFileChange={(e) =>
          handleFileChange(
            e,
            user,
            setLoading,
            setSummary,
            () => handleCloseMenu(setMenuAnchorEl),
            setFileObjects
          )
        }
        handleDragOver={(e) => handleDragOver(e, setDragging)}
        handleDragLeave={() => handleDragLeave(setDragging)}
        handleDrop={(e) =>
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
        dragging={dragging}
        loading={loading}
      />
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
