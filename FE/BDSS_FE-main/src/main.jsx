import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import AdminPage from "./pages/AdminPage.jsx";
import Notification from "./pages/Notification/Notification.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Notification />
    </BrowserRouter>
  </StrictMode>
);
