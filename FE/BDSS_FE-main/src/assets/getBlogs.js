import axios from "axios";

export async function getAllBlogs() {
  const res = await axios.get("http://localhost:8080/blogs");
  return res.data;
}
