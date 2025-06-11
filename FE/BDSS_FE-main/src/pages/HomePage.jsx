import React, { useState } from "react";
import image1 from "../images/image1.jpg";
import "./HomePage.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, FloatingLabel, Form } from "react-bootstrap";
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

export default function HomePage() {
  const [fromDate, setFromDate] = useState("");

  return (
    <>
      <div className="home-page">
        <div className="group-header">
          {/*Navbar */}
          <Navbar />

          {/*body */}
          <div className="text-wrapper2">
            <h2>Hiến máu nhân đạo</h2>
            <div className="wrapper-content">
              <p className="p">
                Hiến máu là một nghĩa cử cao đẹp, thể hiện tinh thần nhân ái và
                trách nhiệm với cộng đồng, góp phần cứu sống hàng triệu người
                mỗi năm.
              </p>
            </div>
            <div className="wrapper-button">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/blood-registration"
              >
                Đăng ký hiến máu
              </Link>
            </div>
          </div>
        </div>
        <div
          className="search-schedule"
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <FloatingLabel
            controlId="fromDate"
            label="Chọn ngày bắt đầu"
            className="mb-3"
            style={{ flex: 1 }}
          >
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="Chọn ngày bắt đầu"
            />
          </FloatingLabel>
          <Link
            to={fromDate ? `/schedule?date=${fromDate}` : "#"}
            style={{ pointerEvents: fromDate ? "auto" : "none" }}
          >
            <Button
              variant="danger"
              style={{ height: 48, minWidth: 120 }}
              disabled={!fromDate}
            >
              Tìm kiếm
            </Button>
          </Link>
        </div>
        <div className="overlap-group2">
          <div className="rectangle">
            <h3>Lợi ích của việc hiến máu</h3>

            <ul className="text-wrapper3">
              <li>
                {heartPulse} Cứu sống người bệnh trong ca cấp cứu, phẫu thuật.
              </li>
              <li>{heartPulse} Kiểm tra sức khỏe miễn phí và định kỳ.</li>
              <li>{heartPulse} Tái tạo máu mới, tuần hoàn tốt hơn.</li>
              <li>{heartPulse} Mang lại niềm vui và ý nghĩa nhân đạo.</li>
            </ul>

            <Link
              to={"/FAQ"}
              style={{ textDecoration: "none", color: "white" }}
              className="wrapper-button2"
            >
              Xem thêm
            </Link>
          </div>
          <img
            data-aos="fade-right"
            data-aos-duration="710"
            data-aos-delay="200"
            data-aos-easing="ease-in-out"
            className="img"
            alt="Ellipse"
            src={image1}
          />
        </div>

        <div className="overlap-group3">
          <div className="group3-row1">
            <div
              data-aos="fade-in"
              data-aos-duration="720"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-10">
                Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B
              </p>

              {/* Clipboard Heart Fill Icon */}
              {clipboardHeart}
            </div>
            <div
              data-aos="fade-in"
              data-aos-duration="730"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-11">
                Không nghiện ma túy, rượu bia và các chất kích thích
              </p>

              {/* Capsule Pill Icon */}
              {capsulePill}
            </div>

            <div
              data-aos="fade-in"
              data-aos-duration="740"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-12">
                Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi
              </p>

              {/* People Fill Icon */}
              {peopleFill}
            </div>
            <p
              data-aos="fade-in"
              data-aos-duration="750"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-title"
            >
              Tiêu chuẩn để được hiến máu
            </p>
          </div>
          <div className="group3-row2">
            <div
              data-aos="fade-in"
              data-aos-duration="760"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-10">
                Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg
              </p>
              {bodyFill}
            </div>

            <div
              data-aos="fade-in"
              data-aos-duration="770"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-11">
                Không mắc các bệnh truyền nhiễm qua đường máu
              </p>
              {/* Virus Icon */}
              {virusFill}
            </div>

            <div
              data-aos="fade-in"
              data-aos-duration="780"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-11">
                Không mắc các bệnh lý mãn tính hoặc cấp tính về tim mạch huyết
                áp, gan, hô hấp,...
              </p>
              {/* Heart Pulse Fill Icon */}
              {heartPulse}
            </div>

            <div
              data-aos="fade-in"
              data-aos-duration="800"
              data-aos-delay="200"
              data-aos-easing="ease-in-out"
              className="overlap-group3-content"
            >
              <p className="text-wrapper-13">
                Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả
                Nam và Nữ
              </p>
              {/* Calendar 3 Icon */}
              {celenderIcon}
            </div>
          </div>
        </div>
        <div className="overlap-group4">
          <div className="overlap-group4-content">
            <h2 style={{ color: "rgb(35, 108, 218)" }}>Trước khi hiến máu</h2>
            <ul>
              <li>
                Đêm trước khi hiến máu không nên thức quá khuya (ngủ ít nhất 6
                tiếng).
              </li>
              <li>Nên ăn nhẹ, không ăn các đồ ăn có nhiều đạm, nhiều mỡ.</li>
              <li>Không uống rượu, bia.</li>
              <li>Chuẩn bị tâm lý thực sự thoải mái.</li>
              <li>Mang theo giấy tờ tùy thân.</li>
              <li>Uống nhiều nước.</li>
            </ul>
          </div>
          <div className="overlap-group4-content">
            <h2 style={{ color: "rgb(218, 35, 35)" }}>Sau khi hiến máu</h2>
            <ul>
              <li>Duỗi thẳng, hơi nâng cao cánh tay trong 15 phút.</li>
              <li>Hạn chế gập tay trong quá trình nghỉ sau hiến máu.</li>
              <li>Nghỉ tại điểm hiến máu tối thiểu 15 phút.</li>
              <li>Uống nhiều nước.</li>
              <li>Chỉ ra về khi cảm thấy thực sự thoải mái.</li>
              <li>
                Nếu vết băng cầm máu chảy máu, hãy nâng tay lên, ấn nhẹ vào vết
                bông, ngồi xuống và báo nhân viên y tế hỗ trợ.
              </li>
            </ul>
          </div>
        </div>
        {/*Footer*/}
        <Footer />
      </div>
    </>
  );
}


