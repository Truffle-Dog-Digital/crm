// src/App.jsx
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import ToolbarComponent from "./toolbar/ToolbarComponent";
import BodyComponent from "./body/BodyComponent";

const App = () => {
  return (
    <AuthProvider>
      <div>
        <ToolbarComponent />
        <BodyComponent />
      </div>
    </AuthProvider>
  );
};

export default App;
