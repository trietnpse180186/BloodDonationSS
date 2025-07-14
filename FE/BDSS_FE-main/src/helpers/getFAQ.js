import axios from "axios";

export default async function getFAQ() {
  const request = await axios.get("http://localhost:8080/faq");
  return request.data;
}
