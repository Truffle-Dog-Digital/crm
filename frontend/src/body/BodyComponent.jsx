// src/body/BodyComponent.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const BodyComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="background.paper"
    >
      <Typography variant="h6">Log in to get started</Typography>
    </Box>
  );
};

export default BodyComponent;
