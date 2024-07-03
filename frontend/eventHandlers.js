import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { saveImportToFirestore } from "./saveImportToFirestore";

export const handleSignIn = async (auth) => {
  const provider = new GoogleAuthProvider();
  try {
    console.log("Signing in...");
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in: ", error);
  }
};

export const handleSignOut = async (auth, handleCloseUserMenu) => {
  try {
    console.log("Signing out...");
    await signOut(auth);
    handleCloseUserMenu();
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export const handleOpenUserMenu = (event, setAnchorEl) => {
  console.log("Opening user menu");
  setAnchorEl(event.currentTarget);
};

export const handleCloseUserMenu = (setAnchorEl) => {
  console.log("Closing user menu");
  setAnchorEl(null);
};

export const handleOpenMenu = (event, setMenuAnchorEl) => {
  console.log("Opening menu");
  setMenuAnchorEl(event.currentTarget);
};

export const handleCloseMenu = (setMenuAnchorEl) => {
  console.log("Closing menu");
  setMenuAnchorEl(null);
};

export const handleFileChange = (
  event,
  user,
  setLoading,
  setSummary,
  handleCloseMenu
) => {
  const file = event.target.files
    ? event.target.files[0]
    : event.dataTransfer.files[0];
  saveImportToFirestore(file, user, setLoading, setSummary, handleCloseMenu);
};

export const handleDragOver = (event, setDragging) => {
  event.preventDefault();
  setDragging(true);
  console.log("Dragging over");
};

export const handleDragLeave = (setDragging) => {
  setDragging(false);
  console.log("Drag leave");
};

export const handleDrop = (event, setDragging, handleFileChange) => {
  event.preventDefault();
  setDragging(false);
  console.log("File dropped");
  handleFileChange(event);
};
