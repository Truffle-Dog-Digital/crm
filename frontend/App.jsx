// App.jsx
import React, { useState } from "react";
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
} from "./eventHandlers";
import ToolbarComponent from "./Toolbar";
import UploadArea from "./UploadArea";
import "./App.css";
import { saveImportToFirestore } from "./saveImportToFirestore";
import useAuthState from "./useAuthState";
import useFileHandlers from "./useFileHandlers";
import withLoading from "./withLoading.jsx";
function App({ loading, setLoading }) {
  const user = useAuthState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [summary, setSummary] = useState(null);

  const {
    fileObjects,
    dragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileHandlers(user, setLoading, setSummary);

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
        handleFileChange={(e) =>
          handleFileChange(e, () => handleCloseMenu(setMenuAnchorEl))
        }
        setMenuAnchorEl={setMenuAnchorEl}
        setAnchorEl={setAnchorEl}
        auth={auth}
      />
      <UploadArea
        user={user}
        handleFileChange={(e) => handleFileChange(e)}
        handleDragOver={(e) => handleDragOver(e)}
        handleDragLeave={handleDragLeave}
        handleDrop={(e) => handleDrop(e)}
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
    </div>
  );
}

export default withLoading(App);
