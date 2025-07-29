import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { getAllBlogs } from "../../helpers/getBlogs";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllBlogs().then(setBlogs).catch(console.error);
  }, []);

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeBlogModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Navbar />
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>Latest Articles & News</h1>
          <p>Stay informed about blood donation and healthcare advancements</p>
        </div>
      </div>

      <div className="blog-layout">
        <div className="blog-container">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="blog-card"
              onClick={() => openBlogModal(post)}
            >
              <div className="blog-card-image-container">
                <img
                  className="blog-image"
                  src={post.imageUrl}
                  alt={post.title}
                />
                <div className="blog-card-overlay">
                  <span>Read More</span>
                </div>
              </div>
              <div className="blog-content">
                <h3>{post.title}</h3>
                <div className="blog-meta">
                  <span className="blog-date">
                    {new Date(
                      post.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                  <span className="blog-category">Health</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      {isModalOpen && selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeBlogModal}>
          <div
            className="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-button" onClick={closeBlogModal}>
              ×
            </button>

            <img
              src={selectedBlog.imageUrl}
              alt={selectedBlog.title}
              className="modal-blog-image"
            />

            <h2 className="modal-blog-title">{selectedBlog.title}</h2>

            <div className="modal-blog-meta">
              <span className="modal-blog-date">
                {new Date(
                  selectedBlog.createdAt || Date.now()
                ).toLocaleDateString()}
              </span>
              <span className="modal-blog-category">Health</span>
            </div>

            <div className="modal-blog-content">{selectedBlog.content}</div>

            <div className="modal-blog-description">
              {selectedBlog.description}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
