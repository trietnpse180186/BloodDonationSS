import { useState } from "react";
import WebRoutes from "./routes/WebRoutes";
import ScrollToTop from "./assets/icons/scrollToTop";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ScrollToTop />
      <WebRoutes />
    </>
  );
}

export default App;
