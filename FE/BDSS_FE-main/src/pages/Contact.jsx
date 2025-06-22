import React from "react";
import "./Contact.css";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";

export default function Contact() {
  return (
    <>
      {/*-------------------Navbar-----------------------*/}
      <Navbar />
      {/*-------------------Contact-----------------------*/}
      <div className="contact">
        <div className="form-contact">
          <form action="#">
            <div id="text-center">
              <h1>Contact Us</h1>
            </div>
            <div id="sub-form">
              <h5>Full Name</h5>
              <input type="text" placeholder="Full Name" />
            </div>
            <div id="sub-form">
              <h5>Phone Number</h5>
              <input type="text" placeholder="Phone Number" />
            </div>
            <div id="sub-form">
              <h5>Email</h5>
              <input type="text" placeholder="Email" />
            </div>
            <div id="sub-form">
              <h5>Support Request Details</h5>
              <input type="text" placeholder="Support request details" />
            </div>

            <button id="button-sub-form">Submit Request</button>
          </form>
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </>
  );
}
