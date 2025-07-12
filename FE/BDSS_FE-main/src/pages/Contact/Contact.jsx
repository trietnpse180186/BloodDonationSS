import React, { useState } from "react";
import "./Contact.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../helpers/axiosInstance";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    details: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.fullName === "" ||
      formData.phoneNumber === "" ||
      formData.email === "" ||
      formData.details === ""
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/contact",
        formData
      );
      toast.success("Contact form submitted successfully!");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to submit contact form. Please try again later.");
    }
  };
  return (
    <>
      <ToastContainer position="top-center" autoClose={1000} />
      {/*-------------------Navbar-----------------------*/}
      <Navbar />
      {/*-------------------Contact-----------------------*/}
      <div className="contact">
        <div className="form-contact">
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <h1>Contact Us</h1>
            </div>
            <div className="sub-form">
              <h5>Full Name</h5>
              <input
                id="input-form"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="sub-form">
              <h5>Phone Number</h5>
              <input
                id="input-form"
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="sub-form">
              <h5>Email</h5>
              <input
                id="input-form"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="sub-form-details">
              <h5>Support Request Details</h5>
              <textarea
                id="input-form"
                type="text"
                name="details"
                placeholder="Support request details"
                value={formData.details}
                onChange={handleChange}
              />
            </div>
            <button className="button-submit-form" type="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </>
  );
}
