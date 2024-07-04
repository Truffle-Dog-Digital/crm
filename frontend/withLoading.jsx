// withLoading.jsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const withLoading = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    return (
      <>
        <WrappedComponent
          {...props}
          loading={loading}
          setLoading={setLoading}
        />
        {loading && (
          <Dialog open={true}>
            <DialogContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  };
};

export default withLoading;
