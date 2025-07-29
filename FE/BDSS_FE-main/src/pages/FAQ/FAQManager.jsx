import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { toast } from "react-toastify";
import "./FAQManager.css";
import { baseUrl } from "../../Utils/baseUrl";

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const token = sessionStorage.getItem("accessToken");

  console.log("Token:", token);

  useEffect(() => {
    axios
      .get(`${baseUrl}/faq`)
      .then((res) => setFaqs(res.data))
      .catch((err) => toast.error("FAQ error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${baseUrl}/faq/${editingId}`, form, config);
      } else {
        await axios.post(`${baseUrl}/faq`, form, config);
      }
      const res = await axios.get(`${baseUrl}/faq`);
      setFaqs(res.data);
      setForm({ question: "", answer: "" });
      setEditingId(null);
    } catch (err) {
      console.error("FAQ error:", err);
      alert("You do not have permission to perform this action.");
    }
  };

  const handleEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
    });
    setEditingId(faq.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axios.delete(`${baseUrl}/faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (err) {
      console.error("FAQ error:", err);
      alert("You do not have permission to delete this FAQ.");
    }
  };

  return (
    <div
      className="faq-manager"
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-delay="100"
    >
      <h2>FAQ MANAGER</h2>

      <form className="faq-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
        />
        <textarea
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
          rows={5}
        />
        <button type="submit" className="submit-btn">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <h3>FAQ LIST</h3>
      <div className="faq-list">
        {faqs.map((faq) => (
          <div className="faq-card" key={faq.id}>
            <h4>{faq.question}</h4>
            <ul className="faq-answer">
              {Array.isArray(faq.answer)
                ? faq.answer.flatMap((ans, idx) =>
                    ans
                      .split(".")
                      .map((sentence, i) =>
                        sentence.trim() ? (
                          <li key={idx + "-" + i}>{sentence.trim()}.</li>
                        ) : null
                      )
                  )
                : faq.answer
                    .split(".")
                    .map((sentence, i) =>
                      sentence.trim() ? (
                        <li key={i}>{sentence.trim()}.</li>
                      ) : null
                    )}
            </ul>

            <div className="button-group">
              <button
                className="edit-btn"
                onClick={() => {
                  handleEdit(faq);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Update
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(faq.id)}
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
