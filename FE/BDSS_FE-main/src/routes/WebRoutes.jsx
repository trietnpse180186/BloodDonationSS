import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FAQ from "../pages/FAQ";
import Blog from "../pages/Blog";
import DonorRegister from "../pages/DonorRegister";
import Contact from "../pages/Contact";
import DonationSchedule from "../pages/DonationSchedule";
import BloodRegister from "../pages/BloodRegister";
import UserInfo from "../pages/UserInfo";
import BloodRegister2 from "../pages/BloodRegister2";
import UserUpdate from "../pages/UserUpdate";
import StaffPage from "../pages/staffPage";
import AdminPage from "../pages/AdminPage";
import ScrollTotop from "../assets/icons/scrollToTop";
export default function WebRoutes() {
  return (
    <>
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
        <Route path="/schedule" element={<DonationSchedule />}></Route>
        <Route path="/blood-registration" element={<BloodRegister />}></Route>
        <Route path="/blood-registration2" element={<BloodRegister2 />}></Route>
        <Route path="/user/update/:userId" element={<UserUpdate />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
