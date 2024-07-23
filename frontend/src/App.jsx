import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToolbarComponent from "./components/ToolbarComponent";
import PasteHandler from "./components/PasteHandler";
import HumansPage from "./pages/HumansPage";
import BacklogsPage from "./pages/BacklogsPage";
import { CssBaseline, Container } from "@mui/material";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      <ToolbarComponent />
      <Container style={{ marginTop: "64px" }}>
        {user ? (
          <Routes>
            <Route path="/humans" element={<HumansPage />} />
            <Route path="/backlog" element={<BacklogsPage />} />
            <Route path="/" element={<HumansPage />} />
          </Routes>
        ) : (
          <div />
        )}
      </Container>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <PasteHandler />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
