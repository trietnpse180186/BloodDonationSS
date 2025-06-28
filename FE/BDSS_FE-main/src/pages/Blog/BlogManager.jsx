import React, { useEffect, useState } from "react";
import axios from "../../assets/axiosInstance";
import { toast } from "react-toastify";
import "./BlogManager.css";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", imageurl: "" });
  const [editingId, setEditingId] = useState(null);
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => toast.error("Failed to load blogs:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(
          `http://localhost:8080/blogs/${editingId}`,
          form,
          config
        );
      } else {
        await axios.post("http://localhost:8080/blogs", form, config);
      }
      const res = await axios.get("http://localhost:8080/blogs");
      setBlogs(res.data);
      setForm({ title: "", content: "", imageurl: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error adding/updating blog:", err);
      alert("You do not have permission to perform this action.");
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      imageurl: blog.imageurl,
    });
    setEditingId(blog.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:8080/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("You do not have permission to delete this blog.");
    }
  };

  return (
    <div
      className="blog-manager"
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-delay="100"
    >
      <h2>BLOG MANAGER</h2>

      <form className="blog-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={5}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageurl}
          onChange={(e) => setForm({ ...form, imageurl: e.target.value })}
        />
        <button type="submit" className="submit-btn">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <h3>Blog List</h3>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            {blog.imageurl && <img src={blog.imageurl} alt="Blog" />}
            <h4>{blog.title}</h4>
            <p style={{ color: "black" }}>{blog.content}</p>

            <div className="button-group">
              <button
                className="edit-btn"
                onClick={() => {
                  handleEdit(blog);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  handleDelete(blog.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
