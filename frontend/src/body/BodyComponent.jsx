import { useAuth } from "../context/AuthContext";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const BodyComponent = () => {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="background.paper"
    >
      {!user && <Typography variant="h6">Sign in to get started</Typography>}
    </Box>
  );
};

export default BodyComponent;
