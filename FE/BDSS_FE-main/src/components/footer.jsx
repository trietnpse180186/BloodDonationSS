import "./footer.css";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column main-column">
          <h2>Humanitarian Blood Donation Center</h2>
          <p className="footer-description">
            A place to connect kind hearts — every drop of donated blood is a
            priceless gift that brings life.
          </p>
          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>

          <div className="contact-item">
            <h4>Humanitarian Blood Donation Center</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>
                466 Nguyen Thi Minh Khai, Ward 2, District 3, Ho Chi Minh City
              </span>
            </div>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>106 Thien Phuoc, Ward 9, Tan Binh, Ho Chi Minh City</span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 3868 5509 - 028 3868 5507</span>
            </div>
          </div>

          <div className="contact-item">
            <h4>Truyen Mau Huyet Hoc Hospital</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>
                118 Hong Bang Street, Ward 12, District 5, Ho Chi Minh City
              </span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 39571342 - 028 39557858</span>
            </div>
          </div>

          <div className="contact-item">
            <h4>Cho Ray Blood Transfusion Center</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>
                56 Pham Huu Chi, Ward 12, District 5, Ho Chi Minh City
              </span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 39555885</span>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/blood-donation-schedule">Donation Schedule</a>
            </li>
            <li>
              <a href="/blood-registration">Register to Donate</a>
            </li>
            <li>
              <a href="/information">Donation Information</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2025 Vietnam Humanitarian Blood Donation Center. All rights
          reserved.
        </p>
        <div className="heart-icon">
          <FaHeart />
        </div>
      </div>
    </footer>
  );
}
