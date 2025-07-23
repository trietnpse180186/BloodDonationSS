const bloodRegister = [
  {
    id: "q1",
    text: "1. Anh/chị từng hiến máu chưa?",
    options: [
      { value: "q1c1", label: "Có" },
      { value: "q1c2", label: "Không" },
    ],
  },
  {
    id: "q2",
    text: "2. Hiện tại, anh/ chị có mắc bệnh lý nào không?",
    options: [
      {
        value: "q2c1",
        label: "Có",
        hasInput: true,
        inputPlaceholder: "Nhập câu trả lời của bạn",
      },
      { value: "q2c2", label: "Không" },
    ],
  },
  {
    id: "q3",
    text: "3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?",
    options: [
      { value: "q3c1", label: "Có" },
      { value: "q3c2", label: "Không" },
      {
        value: "q3c3",
        label: "Bệnh khác",
        hasInput: true,
        inputPlaceholder: "Nhập tên bệnh",
      },
    ],
  },
  {
    id: "q4",
    text: "4. Trong 12 tháng gần đây, anh/chị có:",
    options: [
      {
        value: "q4c1",
        label:
          "Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm màng não - màng não, uốn ván, phẫu thuật ngoại khoa?",
      },
      { value: "q4c2", label: "Được truyền máu hoặc các chế phẩm máu?" },
      {
        value: "q4c3",
        label: "Tiêm Vacxin?",
        hasInput: true,
        inputPlaceholder: "Nhập loại Vacxin",
      },
      { value: "q4c4", label: "Không" },
    ],
  },
  {
    id: "q5",
    text: "5. Trong 06 tháng gần đây, anh/chị có:",
    options: [
      {
        value: "q5c1",
        label:
          "Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tũy, viêm tủy xương?",
      },
      { value: "q5c2", label: "Sụt cân nhanh không rõ nguyên nhân?" },
      { value: "q5c3", label: "Nổi hạch kéo dài?" },
      {
        value: "q5c4",
        label:
          "Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,...)?",
      },
      {
        value: "q5c5",
        label: "Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?",
      },
      { value: "q5c6", label: "Sử dụng ma tuý?" },
      {
        value: "q5c7",
        label:
          "Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm?",
      },
      {
        value: "q5c8",
        label: "Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B?",
      },
      {
        value: "q5c9",
        label:
          "Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai?",
      },
      { value: "q5c10", label: "Quan hệ tình dục với người cùng giới?" },
      { value: "q5c11", label: "Không" },
    ],
  },
  {
    id: "q6",
    text: "6. Trong 01 tháng gần đây, anh/chị có:",
    options: [
      {
        value: "q6c1",
        label:
          "Khởi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?",
      },
      {
        value: "q6c2",
        label:
          "Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,...)?",
      },
      { value: "q6c3", label: "Không" },
    ],
  },
  {
    id: "q7",
    text: "7. Trong 14 ngày gần đây, anh/chị có:",
    options: [
      {
        value: "q7c1",
        label: "Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?",
      },
      { value: "q7c2", label: "Không" },
      {
        value: "q7c3",
        label: "Khác(Cụ thể)",
        hasInput: true,
        inputPlaceholder: "",
      },
    ],
  },
  {
    id: "q8",
    text: "8. Trong 07 ngày gần đây, anh/chị có:",
    options: [
      {
        value: "q8c1",
        label: "Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?",
      },
      { value: "q8c2", label: "Không" },
      {
        value: "q8c3",
        label: "Khác(Cụ thể)",
        hasInput: true,
        inputPlaceholder: "",
      },
    ],
  },
  {
    id: "q9",
    text: "9. Câu hỏi dành cho phụ nữ:",
    options: [
      {
        value: "q9c1",
        label: "Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?",
      },
      {
        value: "q9c2",
        label:
          "Chấm dứt thai kỳ trong 12 tháng gần đây(sảy thai, phá thai, thai ngoài tử cung)?",
      },
      { value: "q9c3", label: "Không" },
    ],
  },
];
export function getLabelByValue(questionId, value) {
  const question = bloodRegister.find((q) => q.id === questionId);
  if (!question) return "";
  const option = question.options.find((opt) => opt.value === value);
  return option ? option.label : "";
}
export function getQuestionTextById(questionId) {
  const question = bloodRegister.find((q) => q.id === questionId);
  return question ? question.text : "";
}
export default bloodRegister;
