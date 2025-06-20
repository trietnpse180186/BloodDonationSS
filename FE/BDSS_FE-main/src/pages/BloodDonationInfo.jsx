import React, { useState } from "react";
import "./BloodDonationInfo.css";
import AppointmentDetail from "./AppointmentDetail";

export default function BloodDonationInfo() {
  const user = {
    name: "Nguyễn Vũ Len",
    cmnd: "",
    cccd: "033204008316",
    passport: "",
    dob: "20/03/2004",
    gender: "Nam",
    job: "Tổng Đài",
    unit: "",
    bloodGroup: "-",
    address: "472, khu phố Đông Ba, Phường Bình Hòa, Thành Phố Thuận An, Tỉnh Bình Dương",
    phone: "0963832382",
    phone2: "",
    email: "thth19102004@gmail.com"
  };

  const appointments = [
    {
      id: 1,
      location: "466 Nguyễn Thị Minh Khai (thời gian làm việc từ 7g đến 11g)",
      address: "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh",
      date: "14/06/2025",
      time: "07:00 đến 11:00",
      status: "Đã xoá",
    },
    {
      id: 2,
      location: "Trung tâm Truyền máu Chợ Rẫy (Cổng số 6)",
      address: "Cổng số 6 - Bệnh viện Chợ Rẫy, đường Triệu Quang Phục, Phường 12, Quận 5, Tp Hồ Chí Minh",
      date: "26/05/2025",
      time: "07:00 đến 11:00",
      status: "Đã xoá",
    }
  ];

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <div className="donation-info-container">
      <h2>Thông tin đăng ký hiến máu</h2>

      <div className="donation-grid">
        <div className="info-card">
          <h3>Thông tin cá nhân</h3>
          <p><strong>Họ và tên:</strong> {user.name}</p>
          <p><strong>Số CMND:</strong> {user.cmnd || "-"}</p>
          <p><strong>Số CCCD:</strong> {user.cccd}</p>
          <p><strong>Số hộ chiếu:</strong> {user.passport || "-"}</p>
          <p><strong>Ngày sinh:</strong> {user.dob}</p>
          <p><strong>Giới tính:</strong> {user.gender}</p>
          <p><strong>Nghề nghiệp:</strong> {user.job}</p>
          <p><strong>Đơn vị:</strong> {user.unit || "-"}</p>
          <p><strong>Nhóm máu:</strong> {user.bloodGroup || "-"}</p>
        </div>

        <div className="info-card">
          <h3>Thông tin liên hệ</h3>
          <p><strong>Địa chỉ liên hệ:</strong> {user.address}</p>
          <p><strong>Điện thoại di động:</strong> {user.phone}</p>
          <p><strong>Điện thoại bàn:</strong> {user.phone2 || "-"}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="info-card wide-card">
          {selectedAppointment ? (
            <AppointmentDetail
              appointment={selectedAppointment}
              onBack={() => setSelectedAppointment(null)}
            />
          ) : (
            <>
              <h2>Lịch sử đặt hẹn</h2>
              <div className="appointment-list">
                {appointments.map((apt) => (
                  <div className="appointment-card" key={apt.id}>
                    <div className="icon">
                      <img src="data:image/webp;base64,UklGRv4LAABXRUJQVlA4IPILAADQTwCdASp4AXYBPp1Oo00lpCOootNIWRATiWVu/FNZqMAZleOfkwjM7XUXXmvy+9uC2f478TdJqjT1K+Jf3Hrm9JnmHfq50z/Mj+1Xqv+mH0AP5F/jf////+1q9ADy0f3M+HT92P2S9re8hc4XhN2WykXz+LFm6Kwx5HvtPgw2omkjHiNJGPEaSMeI0kY8RpIx4jSRjxGkjHiNJGPEaSMeI0kY8JdfzTW0Py1Qz+V5ukjHiNJGKWQSozrSYLR0qacgic5IfYmkjHiMv8vtFkIK1lc62jg2vN0kY8RpIrh1FrWfaXNTK/y4RcxqYZ0RG2uN6hRNJGPEZb+lmJcjNPyUTUOAQ4sKREtUsaFKEd4GkjHiNJGKsOGkvn5ouv1HFTjU5L4ore04LUKJpIx4TR3/cEwhZf+QAD1zQvb2eVlYkxd/+qjWJpIx4UQNpjxkTOG67nrD070xw9gnxXXJD7E0jrbwK39ZTu/5R8YG4mz/y042uSwHQoEkY8RpHWcPybBN3ZLT7ipmtEhRtqdVfnJD7Ey1wba3FDlI84w95Rzc4WC3rExJ6hRNJGKUAVjEmC74+gTlx2gh5gjBZgeVnzBwVdpwrWMeI0jr09zmLrqPkhtzaxNVf5CndLAvBBOAtznNmzeV5ukd7gZdQYftXDP/4OG8fhh1VUyzTZIG5al5CiaSMeIeVxaD4VsRWra9HQASiAAGvqLgLU/wBKYoyp68UItA+xNJGPNcLLn6L6RiRWJ8Hmg0wm/XYhpajt5Xm6SMeI2cUGFXxcu2v4avnM2FT/fZrHnGSH2JpIx4jSR5KrK338rzdJGPEaSMeI0kY8RpIx4jSRjxGkjHiNJGPEaSMeI0kY8Q8AD++QYAAAAAABab4i5Im6hTulDdkb1EAYm448X7BisG/FbREL1mE+AAnffcn7+N4C3U/8kuqhFi4LVTMR5Uk1SQO3j95n6e8uhpfhI1JyBtTRTfhQ8yRqHPxHZJpxQAWRRcPLW5llLNtUOgqUpZpB5xyYmE9UNtE0BFQRDHjhJpOmJ3WSjX/7E/btgORoEiAg9QYSWCo1fhvunXFVXKLUWtrPB25D1cBDJ/xZKXo3g56rw2Wpwsc2zQTFtt8m279qPJCQBBpGyWhjc1fy6vQNKrDJ59Q/zFq7ogCMnDihdx6anhQy5rqQOceyHttd+WFvpYSiiZrZFxfkONacfdckF3kOLXQ/LrYdc0YD6fWccHJb3RI5mcP3SIrOcHlgMPDa8zdbFkO/c/iyUvSMJBYAiYmJk7Qn8WDmgg6Vi4Xto0p1dNHFb+ST3CspHNmQGDH0QNT/zkdFkNFRjgEjXYN7hWN3KxyCJqgOv1V3EXvPX7lSGGqIdkgSrDZA3BD35ka9rXqWxwLPF50gAxDULePc+558fAA0uAsSzARq6zj3MrBmbIaKG0K+iuzCm+/pPELgSeeNniPjvuKujUKTkKHumCh1NT6WsZkx8FtggIdjZxWdMTa70Lz9rCsKwhw/TRludMAC2GTkJc6LW1GRXnS6TUeZL4CZAiJdTEdMdVv6V6UlmYl3HLQDQD80SJOIjH5dJ2RGPzd48dMAzlhbdSzfeq+XZve1tHNFokbtsfI8lAo9BLMqHvrtRBRjLtQSrLt8zSNITGFSkfQ2rMcCS6cmWOokJz1UULSqj+U9u9uUUBsUBHOCh5jm1A9zhDQZH5uvWM5XPp903Awp+9wABRP8pOqOoD7JZ7gzNVnRcCHCPf8m/bQLciDBO01F0mMr+xFOHI0/Zx4Pjb+RcSYsPv3U6UcZ/0ao0xtFIox/zpN20CgNovZod//LLXs+eTwRJ1r6TD9SWDGrrQInY/Ylz1hjTCUhVmUtKzz6aj6FINjefJC25RJ7fUoQNhpXPcovppPAW4urHV2oyFa+6mYjYXEOREifzenQP1E5fzcE9rtbjFDKUOFHvtkEpwUanwjhlpf1ivtkPrPg2e7mmUKoG3gOPs/+Twj80NeflC0A+ZqjHllz0vX0cTn8bOJ1i96ZcKx7smPCQdierjYCj/uYQIcGAP5beOF2k7Zl5bpoQSHAc1z8kfytZlXAKtdpgRotpCpQ7I824egdN9FGMiiQBGHI0KseCCLUYI026ZXcZEn/Fnj4D4qb06KvpwYgDyx/io6YZRa2r/DNSXvfSNygsITCcO02fuQBL4fJSWiAS+b79PEdBh7SmM/EKZqqRAtFLhnFhIrLmkl/4RrepiVnvtRk4806NjVZjo/jUDBbGTfp/+ASX/iOQcxjyXQXf+Il43IPx6lzWJz5R6AmuEBgJrF/F+dF5I7DCisXGugfT1SrOV4QxvyipMjEodA8NuRhF6S4njLojjBxeOklIS5Kzjke1zwFClP3BYlx+Cp34XZeVKP8PWuCLPB5YOF7zRWzxzEtOJ5sUTNVJ0L/wY+yHuIdGVT4MCCcq1bgj58wY3R+gye1MMwcjIVQBJGK5LeAbP9g5Hc6CXOCD4Uv6JxDR6fa/Ad7oniiN0faK5C1T2jcQmQDXzKgUkMiTzOpeqqU7YgApuGdpXjXs74wPHXZE6Ocvoehel0GI28uoBS8TxwxyU8b5xmNm27g+6d6QYxRUDG4ew0UXSAnrDgGfNq9EEYwrOl5egR4afipk43RbMs1kb7jcAxNeEs8zVed8Cs42IuxgPX3/6ABbg9ltrU0d/KEjfF2nqbnoaBL1+cgU+P2N5flYwb3sehJWcsTkP6ekExFnwTMQJhuqRiPeot5vwXkumK+fTpy9ECtJa5MCQE298b5LENzFxV3Dct3EAWL6ozC1OkjCD3k1hRIwC5T1e2VnfuDTgOORMjV7mzyI3BweQ5flH6opZPDvp/zhuYcvaspVCg/h3pgYXYy7jiDq2cnxc5e04bf4TevIOhpCvPaNRjF1cLVPL9V6cZ/0qRCvJdQLedFLUlKAB1WnU3dtA1RMyR/k5YqNe3WaggCWZRq8cjNKjJ9NWgF1RtKKTeDQmZAckXrfYM2ynrnnjeVDlQORC7S0D5fdT/5T0F3s332psDDKZ4maQgxsh1aHKtYB3tNgNwIENL0LL8PGHUAa+OfpAg0fGt1nKnHsNWRc0o/4IVtBt030VgrAjE28AVY3vqBrl8vNpw6PhuedT3Imi4ny/uXuREMtD4+Zfh6zlktNdf+66xtfcp1dLdhjmhjFxagbQkQ9v1RbJkDiUPhi3OOnM+vIAW1g+V6cMEiYDYIod1IPy2cn6TYzFVAOXBnLXd2GPSY6unX6Yjh/cs03dqrWF5+a/abjaR/6Ha+/Xrz+S4m5Ddme/n3VrA6iZb2facYetxXtKOliCKdrcsh5NIUy+4kkYLYcoCutcPBPgjqqhER4KN2/+fCGMgGcMvhlmEP51QKANEhlogO+X+Dq1w5CgPw5UoCgUIV4XCQ8ZJNEij0b8//M7ijUx6LGLesaBkNoO6UQ6ZN9yHiRA8mkboNLpBPUbNLsXI/RYniTKYlV0TdzRBD3B2e0UWPvSk1rdKikMzneLRD22KqTrfmdORifFVOQr1mEF+32bfkkN5aBg6fH8oyHkKGOoIJ04FnBBJcldjjnV/AtydNDCAs/7k0tp75hhnj+/GfQ8gWdZ4NctOBI5EmKNPqzvaXm9SbT3VxoOKUGwxXLHWzHSmxK70R3lOLt4Q60fLrxyQM8gURu9M5Uc6QSQDUZSB4htGsA1cMygTFpssaYABid2UjiMP4ZqqfrVbgZROBRloK8HLsjyds5aQEpycbU1exDoen+P+mlVWCc9xbmSAttNjBFHMi89rvmmGP2tmQ8hQm0gvZ1WCiehBJxdTbEf19X8vwfnSfl/VKQplofurb86MARAPft1hoCGZrijLU9/g1k2noWVLlBaakHeVnlR4UKr+k8JRzrhBNMqYtq7gJNg86jpt4BwCPmZQraT2lW+V1ByTzL3CStKI/I5Uv2utvy5+8ptlANeKZmaZmO3G0tEwzuZYzjhuYpMAO56OKYA2WtrumeV4+OpLMEnq04cHfkzL3eq817tw/FkZnY4NBmX+oLfk/eeC3jRCvlhiqHwel6UYPVdCuUbcAAdQ9FF1l/BkHAHVTAAAAAAAAAAAAAA" alt="Hiến máu" />
                      <p>Hiến máu</p>
                    </div>
                    <div className="info">
                      <strong className="location" style={{ color: "#b30000" }}>
                        {apt.location}
                      </strong>
                      <p><i className="fa fa-map-marker-alt"></i> {apt.address}</p>
                      <p><i className="fa fa-clock"></i> {apt.time} - {apt.date}</p>
                    </div>
                    <div className="actions">
                      <span className="badge" style={{ backgroundColor: "#d9534f" }}>{apt.status}</span>
                      <button
                        style={{ backgroundColor: "#3366FF", color: "#fff" }}
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        📄 Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
