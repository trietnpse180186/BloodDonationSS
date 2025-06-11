import React from "react";
import "./FAQ.css";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
export default function FAQ() {
  const ListFAQ = [
    {
      question: "Ai có thể tham gia hiến máu?",
      answer: [
        "Từ 18-60 tuổi, tình nguyện và đủ sức khỏe.",
        "Cân nặng ≥ 45kg, không mắc bệnh truyền nhiễm.",
        "Cách lần hiến máu gần nhất ít nhất 12 tuần.",
        "Có giấy tờ tùy thân hợp lệ.",
      ],
    },
    {
      question: "Quy trình hiến máu diễn ra như thế nào?",
      answer: [
        "Đăng ký thông tin cá nhân và kiểm tra sức khỏe.",
        "Lấy mẫu máu để xét nghiệm nhóm máu và các bệnh truyền nhiễm.",
        "Tiến hành hiến máu dưới sự giám sát của nhân viên y tế.",
        "Nghỉ ngơi và nhận quà sau khi hiến máu.",
      ],
    },
    {
      question: "Sau khi hiến máu cần lưu ý gì?",
      answer: [
        "Uống đủ nước và ăn nhẹ để phục hồi sức khỏe.",
        "Tránh vận động mạnh trong 24 giờ đầu sau khi hiến máu.",
        "Theo dõi sức khỏe, nếu có triệu chứng bất thường thì liên hệ ngay với cơ sở y tế.",
      ],
    },
    {
      question: "Nhóm máu A,B,O,AB có thể hiến cho nhóm máu nào?",
      answer: [
        "Người có nhóm máu O có thể cho máu cho tất cả các nhóm máu: O, A, B, AB. Đây là nhóm máu cho phổ quát.",
        "Người có nhóm máu A có thể cho máu cho người có nhóm A và AB",
        "Người có nhóm máu B có thể cho máu cho người có nhóm B và AB.",
        "Người có nhóm máu AB chỉ có thể cho máu cho người có nhóm AB. Tuy nhiên, AB là nhóm nhận phổ quát, có thể nhận máu từ tất cả các nhóm máu (O, A, B, AB).",
      ],
    },
    {
      question: "Máu của tôi sẽ được làm những xét nghiệm gì?",
      answer: [
        "Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các vius lây qua đường truyền máu.",
        "Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…",
      ],
    },
  ];
  return (
    <>
      {/*Header------------------------------------------------*/}
      <Navbar />
      {/*Accordion------------------------------------------------*/}
      <div>
        <h1 className="faq-title">Câu hỏi thường gặp</h1>
        <div className="faq-container">
          {ListFAQ.map((items, index) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">{items.question}</summary>
              <ul className="faq-answer">
                {items.answer.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
