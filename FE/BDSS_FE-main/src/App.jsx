import { useState } from "react";

import WebRoutes from "./routes/WebRoutes";
import DonationSchedule from "./pages/DonationSchedule";
import ScrollToTop from "./assets/icons/scrollToTop";
import
  AppointmentSchedule1 from "./pages/AppointmentSchedule1";
  import BloodDonationInfo from "./pages/BloodDonationInfo";
function App() {
  return (
    <>
      <ScrollToTop />
      <BloodDonationInfo />
    </>
  );
}

export default App;
