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
// import BlogSection from "../components/BlogSection"; // Uncomment if you want to use BlogSection
export default function WebRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/donor-register" element={<DonorRegister />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/schedule" element={<DonationSchedule />}></Route>
      <Route path="/blood-registration" element={<BloodRegister />}></Route>
    </Routes>
  );
}
