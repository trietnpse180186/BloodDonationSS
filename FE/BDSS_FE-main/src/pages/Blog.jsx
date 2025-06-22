import React, { useEffect, useState } from "react";
import "./Blog.css";
import { Link } from "react-router";
import logo from "../images/logo.jpg";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
import { getAllBlogs } from "../assets/getBlogs";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs().then(setBlogs).catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      {/* ==================================================== */}
      <div
        className="blog-layout"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="100"
      >
        <div className="blog-container">
          {blogs.map((post) => (
            <div key={post.id} className="blog-card">
              <img
                className="blog-image"
                src={post.imageurl}
                alt={post.title}
              />
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p className="meta">{post.content}</p>
                <p>{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
