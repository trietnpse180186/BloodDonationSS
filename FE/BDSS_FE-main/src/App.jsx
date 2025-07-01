import WebRoutes from "./routes/WebRoutes";
import { ToastContainer } from "react-toastify";
import UserNotification from "./pages/Notification/UserNotification.jsx";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <WebRoutes />
    </>
  );
}

export default App;
