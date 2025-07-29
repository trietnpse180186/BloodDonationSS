import axios from "axios";
import { baseUrl } from "../Utils/baseUrl";

export async function getAllBlogs() {
  const res = await axios.get(`${baseUrl}/blogs`);
  return res.data;
}
