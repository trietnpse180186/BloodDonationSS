import React from "react";
import "./Contact.css";
import contact1 from "../images/contact1.jpg";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";

export default function Contact() {
  return (
    <>
      {/*-------------------Navbar-----------------------*/}
      <Navbar />
      {/*-------------------Contact-----------------------*/}
      <div className="contact">
        <div className="contact-header-img" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={contact1}
              alt="Contact"
              style={{
                width: "100%",
              }}
            />
          </div>
          <div
            className="contact-header-form"
            style={{
              position: "absolute",
              top: "8%",
              right: "8%",
              color: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "500px",
              height: "480px",
            }}
          >
            <h1>Bạn cần hỗ trợ?</h1>
            <br />
            <p>
              Hãy để lại thông tin và thắc mắc của bạn, hoặc có thể liên hệ qua
              hotline phía bên dưới.
            </p>
            <br />
            <div className="form-text">
              <label>Họ và Tên</label>
              <br />
              <input
                className="form-input"
                type="text"
                style={{ width: "300px", height: "45px", margin: "10px 0px" }}
                placeholder="Vd: Nguyen Van A"
              />
            </div>
            <div className="form-text">
              <label>Email</label>
              <br />
              <input
                className="form-input"
                type="text"
                style={{ width: "300px", height: "45px", margin: "10px 0px" }}
                placeholder="Vd: gmd@gmail.vn"
              />
            </div>
            <div className="form-text">
              <label>Lời nhắn</label>
              <br />
              <input
                className="form-input"
                type="text"
                style={{ width: "300px", height: "45px", margin: "10px 0px" }}
              />
            </div>
            <div className="form-submit">
              <button className="button">Gửi lời nhắn</button>
            </div>
          </div>
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </>
  );
}
