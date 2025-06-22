import React, { useEffect, useState } from "react";
import "./FAQ.css";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
import getFAQ from "../assets/getFAQ";
export default function FAQ() {
  const ListFAQ = [
    {
      question: "Who can donate blood?",
      answer: [
        "Aged 18-60, voluntary and in good health.",
        "Weigh at least 45kg, not suffering from infectious diseases.",
        "At least 12 weeks since the last blood donation.",
        "Have valid identification documents.",
      ],
    },
    {
      question: "What is the blood donation process?",
      answer: [
        "Register personal information and undergo a health check.",
        "Take a blood sample to test blood type and infectious diseases.",
        "Donate blood under the supervision of medical staff.",
        "Rest and receive a gift after donating blood.",
      ],
    },
    {
      question: "What should I pay attention to after donating blood?",
      answer: [
        "Drink enough water and have a light meal to recover.",
        "Avoid strenuous activities within the first 24 hours after donating.",
        "Monitor your health; if you have any unusual symptoms, contact a medical facility immediately.",
      ],
    },
    {
      question: "Which blood groups can A, B, O, AB donate to?",
      answer: [
        "People with blood group O can donate to all blood groups: O, A, B, AB. This is the universal donor group.",
        "People with blood group A can donate to those with blood group A and AB.",
        "People with blood group B can donate to those with blood group B and AB.",
        "People with blood group AB can only donate to those with blood group AB. However, AB is the universal recipient group and can receive blood from all groups (O, A, B, AB).",
      ],
    },
    {
      question: "What tests will be performed on my blood?",
      answer: [
        "Screening for HIV, hepatitis B, hepatitis C, and other blood-borne viruses.",
        "Screening for chronic diseases: cardiovascular, blood pressure, respiratory, stomach, etc.",
      ],
    },
  ];
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
