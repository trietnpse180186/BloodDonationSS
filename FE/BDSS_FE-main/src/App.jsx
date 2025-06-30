import AdminPage from "./pages/Admin/AdminPage";
import WebRoutes from "./routes/WebRoutes";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminPage />
    </>
  );
}

export default App;
