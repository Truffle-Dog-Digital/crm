import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Box from "@mui/material/Box"; // Make sure this is last, otherwise it breaks the default theme somehow

const ToolbarComponent = ({
  user,
  anchorEl,
  menuAnchorEl,
  handleOpenMenu,
  handleCloseMenu,
  handleOpenUserMenu,
  handleCloseUserMenu,
  handleSignOut,
  handleSignIn,
  handleFileChange,
  setMenuAnchorEl,
  setAnchorEl,
  auth,
  setLoading,
  setSummary,
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {user && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => handleOpenMenu(e, setMenuAnchorEl)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" component="div">
            Truffle Dog Digital CRM
          </Typography>
        </Box>
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={user.email}>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                onClick={(e) => handleOpenUserMenu(e, setAnchorEl)}
                sx={{ cursor: "pointer" }}
              />
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleCloseUserMenu(setAnchorEl)}
            >
              <MenuItem
                onClick={() =>
                  handleSignOut(auth, () => handleCloseUserMenu(setAnchorEl))
                }
              >
                Sign Out
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={() => handleCloseMenu(setMenuAnchorEl)}
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
                  Load JSONL
                  <input
                    id="upload-csv"
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFileChange(e, user, setLoading, setSummary, () =>
                        handleCloseMenu(setMenuAnchorEl)
                      )
                    }
                  />
                </label>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => handleSignIn(auth)}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarComponent;
