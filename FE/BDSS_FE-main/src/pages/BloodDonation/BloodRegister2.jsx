import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import bloodRegister from "../../helpers/bloodRegister";
import { Link, useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BloodRegister2() {
  const [answers, setAnswers] = useState({});
  const [inputs, setInputs] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const allAnswered = bloodRegister.every((q) => answers[q.id]);

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error("Please complete all answers.");
      return;
    }
    const surveyData = bloodRegister.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
      additionalInfo: inputs[q.id] || "",
    }));
    toast.success("Save Survey Data Successfully!");
    navigate("/blood-donation-info", {
      state: {
        bookingData: bookingData,
        surveyData: surveyData,
      },
    });
    console.log("Booking Data:", bookingData);
    console.log("Survey Data:", surveyData);
  };
  const handleRadioChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    const question = bloodRegister.find((q) => q.id === questionId);
    if (!question.options.find((opt) => opt.value === value && opt.hasInput)) {
      setInputs((prev) => ({ ...prev, [questionId]: "" }));
    }
  };

  const handleInputChange = (questionId, value) => {
    setInputs((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <>
      <Navbar />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      ></link>
      <div className="blood-form-container">
        <h2 className="bloodform-title">Đặt lịch hiến máu</h2>
        <div className="booking-progress-survey">
          <div className="progress-step completed">1. Select Date</div>
          <div className="progress-step active">2. Complete Survey</div>
          <div className="progress-step completed">3. Review & Confirm</div>
        </div>
        <div className="bloodform-steps">
          <p className="bloodform-step ">
            <i className="bi bi-calendar-check-fill"></i>Thời gian & Địa điểm
          </p>
          <p className="bloodform-step active">
            <i className="bi bi-calendar2"></i>Phiếu đăng ký hiến máu
          </p>
        </div>
        <div className="bloodform-body2">
          <div className="bloodform-body-content">
            <div className="question-list">
              {bloodRegister.map((question) => (
                <div key={question.id} className="question-container">
                  <p className="question-text">{question.text}</p>
                  <div className="options-container">
                    {question.options.map((option) => (
                      <div key={option.value} className="option-label">
                        <label>
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() =>
                              handleRadioChange(question.id, option.value)
                            }
                          />
                        </label>
                        <span>
                          {option.label}
                          {option.hasInput &&
                            answers[question.id] === option.value && (
                              <input
                                type="text"
                                placeholder={option.inputPlaceholder}
                                value={inputs[question.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(question.id, e.target.value)
                                }
                                className="input-field"
                              />
                            )}
                        </span>
                      </div>
                    ))}

                    <div className="clear-answer-container">
                      <button
                        type="button"
                        className="clear-answer-button"
                        onClick={() => {
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: undefined,
                          }));
                          setInputs((prev) => ({ ...prev, [question.id]: "" }));
                        }}
                      >
                        Clear answer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="buttons">
              <Link to="/blood-registration">
                <button className="button-style">Back</button>
              </Link>
              <button
                className="button-style"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
