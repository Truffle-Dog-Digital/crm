import React from "react";
import { AuthProvider } from "./context/AuthContext";
import ToolbarComponent from "./toolbar/ToolbarComponent";
import BodyComponent from "./body/BodyComponent";

const App = () => {
  return (
    <AuthProvider>
      <ToolbarComponent />
      <BodyComponent />
    </AuthProvider>
  );
};

export default App;
