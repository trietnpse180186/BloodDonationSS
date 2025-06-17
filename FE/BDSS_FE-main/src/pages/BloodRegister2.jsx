import React, { useState } from 'react'
import Navbar from '../assets/navbar'
import Footer from '../assets/footer'
import bloodRegister from '../assets/bloodRegister';
import { Link } from 'react-router';
export default function BloodRegister2() {
  const [answers, setAnswers] = useState({});
  const [inputs, setInputs] = useState({});

  const handleRadioChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    const question = bloodRegister.find(q => q.id === questionId);
    if(!question.find(opt => opt.value === value && opt.hasInput)) {
      setInputs((prev) => ({ ...prev, [questionId]: '' }));
    }
  };
  const handleInputChange = (questionId, value) => {
    setInputs((prev) => ({ ...prev, [questionId]: value }));
  };
  return (
    <>
    <Navbar />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"></link>
    <div className='bloodform-container' >
      <h2 className='bloodform-title'>Đặt lịch hiến máu</h2>
        <div className='bloodform-body1'>
            <p className='step1-icon'><i className="bi bi-check-square-fill"></i>Thời gian & Địa điểm</p>
            <p className='step2'><i class="bi bi-calendar2"></i>Phiếu đăng ký hiến máu</p>
        </div>
        <div className='bloodform-body2'>
          <div className='bloodform-body-content'>
            {bloodRegister.map((question) => (
              <div key={question.id} className='question-container'>
                <p className='question-text'>{question.text}</p>
                <div className='options-container'>
                  {question.options.map((option) => (
                    <label key={option.value} className='option-label'>
                      <input
                        type='radio'
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleRadioChange(question.id, option.value)}
                      />
                      {option.label}
                      {option.hasInput && answers[question.id] === option.value && (
                        <input
                          type='text'
                          placeholder={option.inputPlaceholder}
                          value={inputs[question.id] || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className='input-field'
                        />
                      )}
                    </label>
                  ))}
                  <div className='clear-answer-container'>
                    <button
                      type="button"
                      className="clear-answer-button"
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, [question.id]: undefined }));
                        setInputs(prev => ({ ...prev, [question.id]: '' }));
                      }}
                      >
                      Clear answer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>  
        </div>
        <div className='buttons'>
          <Link to='/blood-registration'>
          <button className='button-style'>Quay lại</button>
          </Link>
          <button className='button-style'>Xác nhận</button>
        </div>
    </div>
    <Footer />
    </>
  )
}
