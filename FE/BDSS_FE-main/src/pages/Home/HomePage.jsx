import React, { useEffect, useState } from "react";

import "./HomePage.css";
import bannerHome from "../../images/bannerHome.jpg";
import NHSBlood from "../../images/NHSBlood.jpg";
import benefit1 from "../../images/benefit1.jpg";
import benefit2 from "../../images/benefit2.jpg";
import benefit3 from "../../images/benefit3.jpg";
import benefit4 from "../../images/benefit4.jpg";
import BloodDonation from "../../images/BloodDonation.jpg";
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
          <div className="group-header-slogan">
            <div className="group-header-img">
              <img className="bannerHome" alt="Home banner" src={bannerHome} />
            </div>
            <div className="group-header-title">
              <h2>GIVE THE GIFT </h2>
              <p className="group-header-sub-title">OF THE LIFE </p>
              <p className="group-header-content">
                Every time you donate blood, you're not just giving a part of
                yourself you're giving someone a second chance at life, a future
                filled with hope, and the precious gift of more time with their
                loved ones.
              </p>
              <div className="group-header-btn">
                <Link className="group-header-link" to="/blood-registration">
                  Give Blood
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">5.102+</div>
            <div class="stat-label">Registered Donors</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">1.427 L</div>
            <div class="stat-label">Total Blood Donated</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">45 min</div>
            <div class="stat-label">Avg. Donation Time</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">7</div>
            <div class="stat-label">Partner Hospitals</div>
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

          <Link to={"/schedule"} className="section-link">
            Check Available Times ⟶
          </Link>
        </div>
        <div className="donor-highlight">
          <div className="img-donor-highlight">
            <img className="donor-highlight-img" alt="Jimeng" src={NHSBlood} />
            <p>England, Give platelets</p>
          </div>
          <div className="text-donor-highlight">
            <p className="p1-text-donor-highlight">White blood cell donation</p>
            <p className="p2-text-donor-highlight">
              Bringing hope and life to cancer patients.
            </p>
            <p className="p3-text-donor-highlight">
              You can help save a life today
            </p>
            <a
              className="a-text-donor-highlight"
              href="https://platelets.blood.co.uk/about-platelets/"
            >
              Learn about platelets
            </a>
          </div>
        </div>

        {/* Step donation blood */}
        <div className="donation_step">
          <p className="donation_step_title">How to donate blood</p>
          <div className="donation-step-content">
            <div className="donation_step_left">
              <div class="vertical-step">
                <div
                  class="arrow-box-first"
                  style={{ backgroundColor: "#4E120D" }}
                >
                  <div class="step-label">
                    <p class="step-number">Step 1</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Registration & ID check</p>
                  <ul>
                    <li>
                      You’ll sign in, show your ID, and read some information
                      about donation.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="vertical-step">
                <div class="arrow-box" style={{ backgroundColor: "#691710" }}>
                  <div class="step-label">
                    <p class="step-number">Step 2</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Health screening</p>
                  <ul>
                    <li>
                      Complete a confidential interview and check temperature,
                      pulse, blood pressure, and hemoglobin.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="vertical-step">
                <div class="arrow-box" style={{ backgroundColor: "#871F16" }}>
                  <div class="step-label">
                    <p class="step-number">Step 3</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Medical eligibility</p>
                  <ul>
                    <li>
                      Staff review your health history and confirm if you're
                      eligible to donate.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="vertical-step">
                <div class="arrow-box" style={{ backgroundColor: "#A2261B" }}>
                  <div class="step-label">
                    <p class="step-number">Step 4</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Blood collection</p>
                  <ul>
                    <li>
                      Your arm is cleaned, the sterile needle is inserted, and
                      blood is drawn (usually ~8–15 minutes for whole blood).
                    </li>
                  </ul>
                </div>
              </div>
              <div class="vertical-step">
                <div class="arrow-box" style={{ backgroundColor: "#BF2E20" }}>
                  <div class="step-label">
                    <p class="step-number">Step 5</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Refreshment & observation</p>
                  <ul>
                    <li>
                      After donation, enjoy snacks and drinks for about 10–15
                      minutes before leaving.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="vertical-step">
                <div class="arrow-box" style={{ backgroundColor: "#DB3626" }}>
                  <div class="step-label">
                    <p class="step-number">Step 6</p>
                  </div>
                </div>
                <div class="step-details">
                  <p>Post‑donation care</p>
                  <ul>
                    <li>
                      Keep the bandage on, avoid heavy activities for a few
                      hours, hydrate well, and eat iron-rich foods.{" "}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="donation_step_img">
              <img src={BloodDonation} />
            </div>
          </div>
        </div>
        {/* Health and Age Criteria for Blood Donors */}
        <div className="criteria-section">
          <p className="criteria-section-title">
            Health and Age Criteria for Blood Donors
          </p>
          <div className="criteria-content">
            <div className="criteria-image">
              <img className="img-criteria-image" src={DRequirement} />
            </div>
            <div className="criteria-list">
              <div className="criteria-list-content">
                <div className="criteria-list-left-content">
                  <div className="criteria-section-content">
                    {capsulePill}
                    <p className="criteria-sub-content">
                      Not addicted to drugs, alcohol, or other stimulants
                    </p>
                  </div>

                  <div className="criteria-section-content">
                    {peopleFill}
                    <p className="criteria-sub-content">
                      Healthy individuals aged between 18 and 60 years
                    </p>
                  </div>

                  <div className="criteria-section-content">
                    {bodyFill}
                    <p className="criteria-sub-content">
                      Weight: Male ≥ 45 kg, Female ≥ 45 kg
                    </p>
                  </div>
                </div>
                <div className="criteria-list-right-content">
                  <div className="criteria-section-content">
                    {virusFill}
                    <p className="criteria-sub-content">
                      Free from blood-borne infectious diseases
                    </p>
                  </div>

                  <div className="criteria-section-content">
                    {heartPulse}
                    <p className="criteria-sub-content">
                      No chronic or acute conditions related to cardiovascular
                      system, blood pressure, liver, or respiratory system...
                    </p>
                  </div>

                  <div className="criteria-section-content">
                    {celenderIcon}
                    <p className="criteria-sub-content">
                      Minimum interval between two donations is 12 weeks for
                      both males and females
                    </p>
                  </div>
                </div>
              </div>
              <div className="criteria-link-content">
                <Link to={"/FAQ"} className="link-content">
                  See more ⟶
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="tips-section">
          <div className="tips-before">
            <div>
              <h2 style={{ color: "#DB230B", fontWeight: "bold" }}>
                Before donating blood
              </h2>
              <ul style={{ listStyleType: "none" }}>
                <li>
                  1. Avoid staying up late the night before (get at least 6
                  hours of sleep).
                </li>
                <li>
                  2. Have a light meal, avoid fatty or high-protein foods.
                </li>
                <li>3. Stay calm and mentally relaxed.</li>
                <li>4. Bring a valid ID or personal identification.</li>
                <li>5. Do not drink alcohol or beer.</li>
                <li>6. Drink plenty of water.</li>
              </ul>
            </div>
          </div>
          <div className="tips-after">
            <div>
              <h2 style={{ color: "#F6AD00", fontWeight: "bold" }}>
                After donating blood
              </h2>
              <ul style={{ listStyleType: "none" }}>
                <li>1. Drink plenty of water.</li>
                <li>2. Rest at the donation site for at least 15 minutes.</li>
                <li>3. Leave only when you feel fully recovered.</li>
                <li>
                  4. Keep your arm straight and slightly elevated for 15
                  minutes.
                </li>
                <li>5. Avoid bending your arm too much while resting.</li>

                <li>
                  6. If the bandaged site bleeds, raise your arm, press gently
                  on the cotton, sit down, and inform medical staff for
                  assistance.
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
