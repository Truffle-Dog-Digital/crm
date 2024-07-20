import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToolbarComponent from "./components/ToolbarComponent";
import PasteHandler from "./components/PasteHandler";
import HumansPage from "./pages/HumansPage";
import BacklogPage from "./pages/BacklogPage";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      <ToolbarComponent />
      {user ? (
        <Routes>
          <Route path="/humans" element={<HumansPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/" element={<HumansPage />} />
        </Routes>
      ) : (
        <div />
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PasteHandler />
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
