import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Auth/Login";
import Register from "../pages//Auth/Register";
import FAQ from "../pages/FAQ/FAQ";
import Blog from "../pages/Blog/Blog";
import DonorRegister from "../pages/Auth/DonorRegister";
import Contact from "../pages/Contact/Contact";
import DonationSchedule from "../pages/DonationSchedule/DonationSchedule";
import BloodRegister from "../pages/BloodDonation/BloodRegister";
import UserInfo from "../pages/User/UserInfo";
import BloodRegister2 from "../pages/BloodDonation/BloodRegister2";
import BloodDonationInfo from "../pages/BloodDonation/BloodDonationInfo";
import AppointmentDetail from "../pages/Appointment/AppointmentDetail";
import UserNotification from "../pages/Notification/UserNotification";
import UserUpdate from "../pages/User/UserUpdate";
import AdminPage from "../pages/Admin/AdminPage";
import ScrollTotop from "../helpers/scrollToTop";
import StaffPage from "../pages/Staff/StaffPage";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ChangePassword from "../pages/User/ChangePassword";
import { NotificationProvider } from "../contexts/NotificationContext";
import EmergencyDonation from "../pages/Emergency/EmergencyDonation";

export default function WebRoutes() {
  return (
    <>
      <NotificationProvider>
        <ScrollTotop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-profile" element={<UserInfo />} />
          <Route path="/user/update/:userId" element={<UserUpdate />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/appointment" element={<AppointmentDetail />} />
          <Route path="/emergency-donation" element={<EmergencyDonation />} />
          <Route path="/schedule" element={<DonationSchedule />} />
          <Route path="/blood-registration" element={<BloodRegister />} />
          <Route path="/blood-registration2" element={<BloodRegister2 />} />
          <Route path="/blood-donation-info" element={<BloodDonationInfo />} />
          <Route path="/appointment-detail" element={<AppointmentDetail />} />
          <Route path="/user-notification" element={<UserNotification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/change-password" element={<ChangePassword />} />
        </Routes>
      </NotificationProvider>
    </>
  );
}
