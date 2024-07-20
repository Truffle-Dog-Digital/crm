import React from "react";
import { AuthProvider } from "./context/AuthContext";
import ToolbarComponent from "./components/ToolbarComponent";
import BodyComponent from "./components/BodyComponent";
import PasteHandler from "./components/PasteHandler";

const App = () => {
  return (
    <AuthProvider>
      <PasteHandler />
      <ToolbarComponent />
      <BodyComponent />
    </AuthProvider>
  );
};

export default App;
