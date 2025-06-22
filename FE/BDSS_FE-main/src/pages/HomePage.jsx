import React, { useEffect, useState } from "react";

import "./HomePage.css";
import bannerHome from "../images/bannerHome.jpg";
import NHSBlood from "../images/NHSBlood.jpg";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../assets/navbar";
import {
  bodyFill,
  capsulePill,
  celenderIcon,
  clipboardHeart,
  heartPulse,
  peopleFill,
  virusFill,
} from "../assets/icons/icon";
import Footer from "../assets/footer";
import { toast } from "react-toastify";

export default function HomePage() {
  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay="100"
        className="home-page"
      >
        <div className="group-header">
          {/*Navbar */}
          <Navbar />
          {/*body */}
          <div className="text-wrapper2">
            <div
              className="wrapper-img"
              data-aos="fade-left"
              data-aos-duration="700"
              data-aos-delay="100"
            >
              <img className="bannerHome" alt="Jimeng" src={bannerHome} />
            </div>
            <div
              className="wrapper-content"
              data-aos="slide-right"
              data-aos-duration="700"
              data-aos-delay="100"
            >
              <h2>GIVE THE GIFT </h2>
              <p className="p-wrapper-content">OF THE LIFE </p>

              <p className="p-content">
                Every time you donate blood, you're not just giving a part of
                yourself you're giving someone a second chance at life, a future
                filled with hope, and the precious gift of more time with their
                loved ones.
              </p>
              <div className="wrapper-button">
                <Link className="text-wrapper-button" to="/blood-registration">
                  Give Blood
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="overlap-group2">
          <h3 className="text-center-group2">Benefits of Blood Donation</h3>

          <ul className="text-wrapper3">
            <li>
              <img src={bannerHome} alt="Benefit 1" className="benefit-icon" />
              <h5>Who can your blood save?</h5>
              <p>Save lives in emergencies and surgeries.</p>
            </li>
            <li>
              <img src={bannerHome} alt="Benefit 2" className="benefit-icon" />
              <h5>Is health check included?</h5>
              <p>Receive free health check-ups.</p>
            </li>
            <li>
              <img src={bannerHome} alt="Benefit 3" className="benefit-icon" />
              <h5>Does donating blood help your body?</h5>
              <p>Stimulate new blood production and improve circulation.</p>
            </li>
            <li>
              <img src={bannerHome} alt="Benefit 4" className="benefit-icon" />
              <h5>Why does blood donation matter?</h5>
              <p>Bring joy and contribute to a meaningful cause.</p>
            </li>
          </ul>

          <Link to={"/schedule"} className="button-wrapper3">
            Check Available Times ⟶
          </Link>
        </div>

        <div className="content-donor">
          <div className="img-content-donor">
            <img className="content-donor-img" alt="Jimeng" src={NHSBlood} />
            <p>England, Give platelets</p>
          </div>
          <div className="text-content-donor">
            <p className="p1-text-content-donor">White blood cell donation</p>
            <p className="p2-text-content-donor">
              Bringing hope and life to cancer patients.
            </p>
            <p className="p3-text-content-donor">
              You can help save a life today
            </p>
            <a
              className="a-text-content-donor"
              href="https://platelets.blood.co.uk/about-platelets/"
            >
              Learn about platelets
            </a>
          </div>
        </div>

        {/* CÓ NÊN THÊM QUY TRÌNH HIẾN MÁU */}

        <div className="overlap-group3">
          <div className="group3-row1">
            <div className="overlap-group3-content">
              {clipboardHeart}
              <p className="text-wrapper-10">
                Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B
              </p>
            </div>

            <div className="overlap-group3-content">
              {capsulePill}
              <p className="text-wrapper-11">
                Không nghiện ma túy, rượu bia và các chất kích thích
              </p>
            </div>

            <div className="overlap-group3-content">
              {peopleFill}
              <p className="text-wapper-12">
                Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi
              </p>
            </div>
          </div>

          <div className="group3-row2">
            <p className="overlap-group3-title">Eligibility Criteria</p>
            <div className="overlap-group3-content">
              {bodyFill}
              <p className="text-wrapper-10">
                Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg
              </p>
            </div>

            <div className="overlap-group3-content">
              {virusFill}
              <p className="text-wrapper-11">
                Không mắc các bệnh truyền nhiễm qua đường máu
              </p>
            </div>

            <div className="overlap-group3-content">
              {heartPulse}
              <p className="text-wrapper-12">
                Không mắc các bệnh lý mãn tính hoặc cấp tính về tim mạch huyết
                áp, gan, hô hấp,...
              </p>
            </div>

            <div className="overlap-group3-content">
              {celenderIcon}
              <p className="text-wrapper-13">
                Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả
                Nam và Nữ
              </p>
            </div>
          </div>
        </div>

        <div className="overlap-group4">
          <div className="overlap-group4-content1">
            <div>
              <img src="https://i.pinimg.com/736x/69/f6/c6/69f6c6abd053ff2ec366fb05905248e1.jpg" alt="" />
            </div>
            <div>
              <h2 style={{ color: "#DB230B", fontWeight: "bold" }}>
                Trước khi hiến máu
              </h2>
              <ul style={{ listStyleType: "none" }}>
                <li>
                  Đêm trước khi hiến máu không nên thức quá khuya (ngủ ít nhất 6
                  tiếng).
                </li>
                <li>Nên ăn nhẹ, không ăn các đồ ăn có nhiều đạm, nhiều mỡ.</li>
                <li>Chuẩn bị tâm lý thực sự thoải mái.</li>
                <li>Mang theo giấy tờ tùy thân.</li>
                <li>Không uống rượu, bia.</li>
                <li>Uống nhiều nước.</li>
              </ul>
            </div>
          </div>
          <div  className="overlap-group4-content2">
            <div>
              <img src="https://i.pinimg.com/736x/aa/de/7a/aade7a2735cb09f9b7748da0247084d5.jpg" alt="" />
            </div>
            <div>
              <h2 style={{ color: "#F6AD00", fontWeight: "bold" }}>
                Sau khi hiến máu
              </h2>
              <ul style={{ listStyleType: "none" }}>
                <li>Uống nhiều nước.</li>
                <li>Nghỉ tại điểm hiến máu tối thiểu 15 phút.</li>
                <li>Chỉ ra về khi cảm thấy thực sự thoải mái.</li>
                <li>Duỗi thẳng, hơi nâng cao cánh tay trong 15 phút.</li>
                <li>Hạn chế gập tay trong quá trình nghỉ sau hiến máu.</li>
                <li>
                  Nếu vết băng cầm máu chảy máu, hãy nâng tay lên, ấn nhẹ vào vết
                  bông, ngồi xuống và báo nhân viên y tế hỗ trợ.
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/*Footer*/}
        <Footer />
      </div>
    </>
  );
}
