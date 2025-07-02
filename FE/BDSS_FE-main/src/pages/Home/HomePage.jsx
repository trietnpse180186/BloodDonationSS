import React, { useEffect, useState } from "react";

import "./HomePage.css";
import bannerHome from "../../images/bannerHome.jpg";
import NHSBlood from "../../images/NHSBlood.jpg";
import benefit1 from "../../images/benefit1.jpg";
import benefit2 from "../../images/benefit2.jpg";
import benefit3 from "../../images/benefit3.jpg";
import benefit4 from "../../images/benefit4.jpg";
import DRequirement from "../../images/DRequirement.jpg";

import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar";
import {
  bodyFill,
  capsulePill,
  celenderIcon,
  heartPulse,
  peopleFill,
  virusFill,
} from "../../icons/icon";
import Footer from "../../components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="group-header">
          <div className="text-wrapper2">
            <div className="wrapper-img">
              <img className="bannerHome" alt="Home banner" src={bannerHome} />
            </div>
            <div className="wrapper-content">
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
              <img src={benefit1} alt="Benefit 1" className="benefit-icon" />
              <h5>Who can your blood save?</h5>
              <p>Save lives in emergencies and surgeries.</p>
            </li>
            <li>
              <img src={benefit2} alt="Benefit 2" className="benefit-icon" />
              <h5>Is health check included?</h5>
              <p>Receive free health check-ups.</p>
            </li>
            <li>
              <img src={benefit3} alt="Benefit 3" className="benefit-icon" />
              <h5>Does donating blood help your body?</h5>
              <p>Stimulate new blood production and improve circulation.</p>
            </li>
            <li>
              <img src={benefit4} alt="Benefit 4" className="benefit-icon" />
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
        <div>
          <p>[......]</p>
        </div>
        <div className="overlap-group3">
          <p className="overlap-group3-title">
            Health and Age Criteria for Blood Donors
          </p>
          <div className="content-group3">
            <div className="content1-group3">
              <img className="img-content1-group3" src={DRequirement} />
            </div>
            <div className="content2-group3">
              <div className="sub1Content2-group3">
                <div className="overlap-group3-subContent1">
                  <div className="overlap-group3-content">
                    {capsulePill}
                    <p className="text-wrapper-group3">
                      Not addicted to drugs, alcohol, or other stimulants
                    </p>
                  </div>

                  <div className="overlap-group3-content">
                    {peopleFill}
                    <p className="text-wrapper-group3">
                      Healthy individuals aged between 18 and 60 years
                    </p>
                  </div>

                  <div className="overlap-group3-content">
                    {bodyFill}
                    <p className="text-wrapper-group3">
                      Weight: Male ≥ 45 kg, Female ≥ 45 kg
                    </p>
                  </div>
                </div>
                <div className="overlap-group3-subContent2">
                  <div className="overlap-group3-content">
                    {virusFill}
                    <p className="text-wrapper-group3">
                      Free from blood-borne infectious diseases
                    </p>
                  </div>

                  <div className="overlap-group3-content">
                    {heartPulse}
                    <p className="text-wrapper-group3">
                      No chronic or acute conditions related to cardiovascular
                      system, blood pressure, liver, or respiratory system...
                    </p>
                  </div>

                  <div className="overlap-group3-content">
                    {celenderIcon}
                    <p className="text-wrapper-group3">
                      Minimum interval between two donations is 12 weeks for
                      both males and females
                    </p>
                  </div>
                </div>
              </div>
              <div className="sub2Content2-group3">
                <Link to={"/FAQ"} className="link-group3">
                  See more ⟶
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-group4">
          <div className="overlap-group4-content1">
            <div>
              <img
                src="https://i.pinimg.com/736x/69/f6/c6/69f6c6abd053ff2ec366fb05905248e1.jpg"
                alt=""
              />
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
          <div className="overlap-group4-content2">
            <div>
              <img
                src="https://i.pinimg.com/736x/aa/de/7a/aade7a2735cb09f9b7748da0247084d5.jpg"
                alt=""
              />
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
                  Nếu vết băng cầm máu chảy máu, hãy nâng tay lên, ấn nhẹ vào
                  vết bông, ngồi xuống và báo nhân viên y tế hỗ trợ.
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
