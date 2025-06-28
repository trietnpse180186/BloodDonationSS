import "./footer.css";
import { FaPhone, FaMapMarkerAlt, FaHeart, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column main-column">
          <h2>Trung tâm Hiến máu Nhân đạo</h2>
          <p className="footer-description">
            Nơi kết nối những tấm lòng nhân ái, mỗi giọt máu hiến tặng là một món quà vô giá mang lại sự sống.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Liên hệ</h3>
          
          <div className="contact-item">
            <h4>Trung tâm hiến máu nhân đạo</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>466 Nguyễn Thị Minh Khai, Phường 2, Quận 3, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>106 Thiên Phước, Phường 9, Tân Bình, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 3868 5509 - 028 3868 5507</span>
            </div>
          </div>
          
          <div className="contact-item">
            <h4>Bệnh viện BTH</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>118 Đ. Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 39571342 - 028 39557858</span>
            </div>
          </div>
          
          <div className="contact-item">
            <h4>Trung tâm truyền máu Chợ Rẫy</h4>
            <div className="contact-detail">
              <FaMapMarkerAlt />
              <span>56 Phạm Hữu Chí, Phường 12, Quận 5, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-detail">
              <FaPhone />
              <span>028 39555885</span>
            </div>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Liên kết nhanh</h3>
          <ul className="footer-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/blood-donation-schedule">Lịch hiến máu</a></li>
            <li><a href="/blood-registration">Đăng ký hiến máu</a></li>
            <li><a href="/information">Thông tin hiến máu</a></li>
            <li><a href="/about">Về chúng tôi</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Trung tâm Hiến máu Nhân đạo Việt Nam. Tất cả quyền được bảo lưu.</p>
        <div className="heart-icon"><FaHeart /></div>
      </div>
    </footer>
  );
}