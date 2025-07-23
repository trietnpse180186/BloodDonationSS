import { NotificationProvider } from "./contexts/NotificationContext";
import WebRoutes from "./routes/WebRoutes";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <NotificationProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <WebRoutes />
      </NotificationProvider>
    </>
  );
}

export default App;
