import React from "react";
import "./Blog.css";
import { Link } from "react-router";
import logo from "../images/logo.jpeg";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
const posts = [
  {
    id: 1,
    title:
      "Hoa hậu Thanh Thủy, Á hậu Ngọc Thảo tham gia hiến máu tại Giọt hồng cội Việt 2025",
    author: "QUANG QUÝ",
    date: "03/06/2025",
    source: "Tiền Phong",
    image:
      "https://image.tienphong.vn/w1966/Uploaded/2025/ttf-ftgktuqz/2025_03_16/hien-mau2-4168-2493.jpg",
    description:
      "STPO - Trong lần thứ hai sự kiện Giọt hồng cội Việt được tổ chức tại vùng đất linh thiêng tỉnh Phú Thọ, Hoa hậu Thanh Thủy và 2 Á hậu Ngọc Thảo, Ngọc Hằng đã cùng lan tỏa thông điệp yêu thương, tham gia hiến máu cứu người.",
    link: "https://tienphong.vn/hoa-hau-thanh-thuy-a-hau-ngoc-thao-tham-gia-hien-mau-tai-giot-hong-coi-viet-2025-post1725462.tpo",
  },
  {
    id: 2,
    title:
      "Nữ sinh Đại học Văn Hiến rạng ngời trong ngày Chủ nhật Đỏ, hiến máu cứu người",
    author: "QUANG QUÝ",
    date: "14/05/2024",
    source: "Tiền Phong",
    image:
      "https://image.tienphong.vn/350x210/Uploaded/2025/mdf-neikxr/2023_12_03/hien-mau-6144.jpg",
    description:
      "TPO - Hàng nghìn sinh viên và các bạn trẻ đã có mặt tại trường Đại học Văn Hiến TPHCM tham gia hoạt động hiến máu tình nguyện Chủ nhật Đỏ.",
    link: "https://tienphong.vn/nu-sinh-dai-hoc-van-hien-rang-ngoi-trong-ngay-chu-nhat-do-hien-mau-cuu-nguoi-post1592270.tpo",
  },
  {
    id: 3,
    title:
      "Tuổi trẻ Công an Nghệ An tình nguyện hiến máu, hỗ trợ kích hoạt tài khoản VNeID cho y bác sĩ",
    author: "PV",
    date: "24/03/2024",
    source: "Tiền Phong",
    image:
      "https://image.tienphong.vn/350x210/Uploaded/2025/buvsob-hvivwsb/2023_06_10/tp-9-7914.jpg",
    description:
      "TPO - Đoàn viên thanh niên Công an tỉnh Nghệ An đã tổ chức hiến máu tình nguyện và hỗ trợ kích hoạt tài khoản định danh điện tử cho các y bác sĩ Bệnh viện Đa khoa tỉnh.",
    link: "https://tienphong.vn/tuoi-tre-cong-an-nghe-an-tinh-nguyen-hien-mau-ho-tro-kich-hoat-tai-khoan-vneid-cho-y-bac-si-post1541784.tpo",
  },
  {
    id: 4,
    title: "Ngày hội hiến máu 'Khát vọng tuổi trẻ - Sẻ chia hạnh phúc'",
    author: "TPO",
    date: "01/03/2023",
    source: "Tiền Phong",
    image:
      "https://image.tienphong.vn/350x210/Uploaded/2025/dg-bfjysszl/2022_08_09/anh-1-5625.jpg",
    description:
      "TPO - Ngày hội hiến máu 'Khát vọng tuổi trẻ - Sẻ chia hạnh phúc' do Đoàn khối các cơ quan Trung ương tổ chức đã thu hút đông đảo đoàn viên, thanh niên tham gia, lan tỏa tinh thần thiện nguyện và ý nghĩa nhân văn sâu sắc.",
    link: "https://tienphong.vn/ngay-hoi-hien-mau-khat-vong-tuoi-tre-se-chia-hanh-phuc-post1460074.tpo",
  },
  {
    id: 5,
    title:
      "Chủ nhật Đỏ 2022: Giới trẻ trên khắp cả nước cùng thổi bùng ngọn lửa hiến máu tình nguyện",
    author: "TPO",
    date: "16/01/2022",
    source: "Tiền Phong",
    image:
      "https://image.tienphong.vn/350x210/Uploaded/2025/ttf-ztmfxuzt/2022_01_23/na1-1859.jpeg",
    description:
      "TPO - Ngày hội Chủ nhật Đỏ năm 2022 đã lan tỏa khắp cả nước, với sự tham gia đông đảo của giới trẻ nhằm cứu sống hàng nghìn bệnh nhân đang cần máu.",
    link: "https://tienphong.vn/chu-nhat-do-2022-gioi-tre-tren-khap-ca-nuoc-cung-thoi-bung-ngon-lua-hien-mau-tinh-nguyen-post1411823.tpo",
  },
];

const BlogSection = () => {
  return (
    <>
      <Navbar />
      {/* ==================================================== */}
      <div className="blog-layout">
        <main className="blog-container">
          <div className="posts">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <img src={post.image} alt={post.title} />
                <div className="post-content">
                  <h3>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-title-link"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="meta">
                    {post.author} - {post.date} | {post.source}
                  </p>
                  <p>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default BlogSection;
