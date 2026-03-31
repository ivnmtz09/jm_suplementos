// src/main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import useAuthStore from "./store/authStore";

/** Initialises the Firebase Auth listener before rendering */
function Root() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => {
    const unsubscribe = checkAuth();
    return unsubscribe; // cleanup on unmount
  }, [checkAuth]);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);
