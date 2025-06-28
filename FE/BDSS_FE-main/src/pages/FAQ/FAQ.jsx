import React, { useEffect, useState } from "react";
import "./FAQ.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import getFAQ from "../../assets/getFAQ";
export default function FAQ() {
  // State to hold FAQ data
  const [faq, setFaq] = useState([]);
  useEffect(() => {
    getFAQ()
      .then(setFaq)
      .catch((error) => {
        console.error("Error fetching FAQ data:", error);
      });
  }, []);
  return (
    <>
      {/*Header------------------------------------------------*/}
      <Navbar />
      {/*Accordion------------------------------------------------*/}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <div className="faq-container">
          {faq.map((items, index) => (
            <details key={items.id || index} className="faq-item">
              <summary className="faq-question">{items.question}</summary>
              <ul className="faq-answer">
                {Array.isArray(items.answer)
                  ? items.answer.flatMap((ans, idx) =>
                      ans
                        .split(".")
                        .map((sentence, i) =>
                          sentence.trim() ? (
                            <li key={idx + "-" + i}>{sentence.trim()}.</li>
                          ) : null
                        )
                    )
                  : items.answer
                      .split(".")
                      .map((sentence, i) =>
                        sentence.trim() ? (
                          <li key={i}>{sentence.trim()}.</li>
                        ) : null
                      )}
              </ul>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
