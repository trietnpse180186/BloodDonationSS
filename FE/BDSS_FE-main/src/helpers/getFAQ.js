import axios from "axios";
import { baseUrl } from "../Utils/baseUrl";

export default async function getFAQ() {
  const request = await axios.get(`${baseUrl}/faq`);
  return request.data;
}
