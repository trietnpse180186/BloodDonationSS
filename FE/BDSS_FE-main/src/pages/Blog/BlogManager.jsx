import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { toast } from "react-toastify";
import "./BlogManager.css";
import { uploadImageToCloudinary } from "../../helpers/uploadImageToCloudinary";
import { FaSpinner } from "react-icons/fa";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/blogs")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load blogs:", err);
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = { ...form, imageUrl };

      if (editingId) {
        await axios.put(
          `http://localhost:8080/blogs/${editingId}`,
          data,
          config
        );
      } else {
        await axios.post("http://localhost:8080/blogs", data, config);
      }
      const res = await axios.get("http://localhost:8080/blogs");
      setBlogs(res.data);
      setForm({ title: "", content: "", imageUrl: "" });
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Error adding/updating blog:", err);
      alert("You do not have permission to perform this action.");
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
    });
    setEditingId(blog.id);
    setImageFile(null);
    setImagePreview(blog.imageUrl || null);
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
          placeholder="Image URL (or upload below)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ margin: "10px 0" }}
        />
        {imagePreview && (
          <div style={{ marginBottom: 10 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="loading-spinner" />{" "}
              {editingId ? "Updating..." : "Creating..."}
            </>
          ) : editingId ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </form>

      <h3>Blog List</h3>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            {blog.imageUrl && <img src={blog.imageUrl} alt="Blog" />}
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
