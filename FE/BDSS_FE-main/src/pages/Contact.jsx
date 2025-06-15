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
              <h1>Liên hệ với chúng tôi</h1>
            </div>
            <div id="sub-form">
              <h5>Họ và tên</h5>
              <input type="text" placeholder="Họ và tên" />
            </div>
            <div id="sub-form">
              <h5>Số điện thoại</h5>
              <input type="text" placeholder="Số điện thoại" />
            </div>
            <div id="sub-form">
              <h5>Email</h5>
              <input type="text" placeholder="Email" />
            </div>
            <div id="sub-form">
              <h5>Chi tiết yêu cầu hỗ trợ</h5>
              <input type="text" placeholder="Nội dung yêu cầu hỗ trợ" />
            </div>

            <button id="button-sub-form">Gửi yêu cầu</button>
          </form>
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </>
  );
}
