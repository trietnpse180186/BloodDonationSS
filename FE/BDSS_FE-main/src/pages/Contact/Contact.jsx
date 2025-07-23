import React, { useState } from "react";
import "./Contact.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../helpers/axiosInstance";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/contact",
        formData
      );
      toast.success("Contact form submitted successfully!");
      // Clear form after successful submission
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        details: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to submit contact form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Navbar />

      <div className="contact-container">
        {/* Contact Information Panel */}
        <div className="contact-info">
          <div className="contact-info-content">
            <h2>Get In Touch</h2>
            <p>
              Have questions about blood donation or need assistance with our
              services? Contact our team using the form or reach out directly
              through the information below.
            </p>

            <div className="contact-method">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div className="contact-text">
                <strong>Call Us</strong>
                +84 123 456 789
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-text">
                <strong>Email Us</strong>
                support@blooddonation.com
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-text">
                <strong>Visit Us</strong>
                132 Quan Nhan, Thanh Xuan, Ha Noi
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us A Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                placeholder="Your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="details">Message</label>
              <textarea
                id="details"
                name="details"
                className="form-control"
                placeholder="How can we help you?"
                value={formData.details}
                onChange={handleChange}
              />
            </div>

            <button
              className={`contact-submit-btn ${isSubmitting ? "loading" : ""}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "" : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
