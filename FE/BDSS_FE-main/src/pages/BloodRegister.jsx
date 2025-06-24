import React, { use, useEffect, useState } from 'react';
import Navbar from '../assets/navbar';
import './BloodRegister.css'
import bloodDonationSchedules from '../assets/donationSchedule';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../assets/footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1); // Set to Monday
  return d;
}

function getWeekDays(startDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function WeeklyDatePicker({ selectedDate, onChange }) {
  // Khởi tạo tuần dựa trên selectedDate
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(selectedDate ? new Date(selectedDate) : new Date()));

  useEffect(() => {
    // Nếu selectedDate thay đổi và nằm ngoài currentWeek, cập nhật lại tuần
    const startOfSelectedWeek = getStartOfWeek(new Date(selectedDate));
    if (currentWeek.getTime() !== startOfSelectedWeek.getTime()) {
      setCurrentWeek(startOfSelectedWeek);
    }
  }, [selectedDate]);

  const weekDays = getWeekDays(currentWeek);

  const handlePrevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(getStartOfWeek(prev));
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(getStartOfWeek(next));
  };

  return (
    <div className="weekly-date-picker">
      <button type="button" className="weekly-nav-btn" onClick={handlePrevWeek}>{'<'}</button>
      {weekDays.map((day) => {
        const value = day.toISOString().split('T')[0];
        return (
          <button
            key={value}
            type="button"
            className={`weekly-day-btn ${value === selectedDate ? 'selected' : ''}`}
            onClick={() => onChange(value)}
          >
            {day.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </button>
        );
      })}
      <button type="button" className="weekly-nav-btn" onClick={handleNextWeek}>{'>'}</button>
    </div>
  );
}

// lấy nhóm máu dựa trên địa điểm
function getBloodGroup(location) {
  const bloodGroup ={
    "Hà Nội – 132 Quan Nhân, Thanh Xuân": ["A", "O"],
    "Hồ Chí Minh – 201B Nguyễn Chí Thanh, Quận 5": ["B", "AB"],
    "Đà Nẵng – 47 Lê Duẩn, Hải Châu": ["A", "B", "O"],
    "Cần Thơ – 315 Nguyễn Văn Linh, Ninh Kiều": ["O"],
    "Hà Nội – 14 Trần Thái Tông, Cầu Giấy": ["A", "B", "AB", "O"],
  }
  return bloodGroup[location] || [];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function BloodRegister() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialDate = params.get('date') || new Date().toISOString().split('T')[0];
  const initialLocation = params.get('location') || '';
  
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  
  useEffect(() => {
  // Nếu selectedLocation không còn trong danh sách địa điểm của ngày mới, thì reset
  const locations = bloodDonationSchedules.filter(item => item.date === selectedDate);
  const found = locations.some(loc => loc.location === selectedLocation);
  if (!found) {
    setSelectedLocation('');
  }
  // Nếu initialLocation hợp lệ, giữ nguyên
}, [selectedDate, selectedLocation]);
  
  // reset selectedLocation khi thay đổi ngày
  useEffect(() => {
    setTimeSelected(false);
  }, [selectedLocation]);
  
  const bloodGroups = getBloodGroup(selectedLocation);
  const locations = bloodDonationSchedules.filter(
    (item) => item.date === selectedDate
  );
  
  // lọc địa điểm theo ngày
  const selectedLocationTime = locations.find(
    (loc) => loc.location === selectedLocation
  );

  // reset timeSelected khi thay đổi địa điểm
  const [timeSelected, setTimeSelected] = useState(null);
  useEffect(() => {
    setTimeSelected(null);
  }, [selectedLocation]);
  
  // kiểm tra xem đã chọn đủ thông tin chưa
  const canContinue = !!selectedDate && !!selectedLocation && !!timeSelected;


  return (
    <>
    <Navbar />
    <div className="bloodform-container">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"></link>
      <h2 className="bloodform-title">Đặt lịch hiến máu</h2>
      <div className="bloodform-body">
        <div className="bloodform-steps">
          <p className="bloodform-step active"><i className="bi bi-check-square"></i>Thời gian & Địa điểm</p>
          <p className="bloodform-step"><i className="bi bi-calendar2"></i>Phiếu đăng ký hiến máu</p>
        </div>
        <div className="bloodform-content">
          <div className="bloodform-section">
            <div className="bloodform-date-section">
              <h3 className="bloodform-section-title"><i className="bi bi-calendar3"></i>Chọn ngày</h3>
              <input 
                type="date" 
                className="bloodform-date-input" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="bloodform-weekly-picker">
              <WeeklyDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>
          </div>

          <div className="bloodform-section">
            <h3 className="bloodform-section-title"><i className="bi bi-geo-alt"></i>Địa điểm hiến máu hiện có</h3>
            {locations.length === 0 ? (
              <div className="bloodform-empty-message">Không có địa điểm hiến máu cho ngày này</div>
            ) : (
              <div className="bloodform-location-list">
                {locations.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`bloodform-location-btn ${selectedLocation === loc.location ? 'selected' : ''}`}
                    onClick={() => setSelectedLocation(loc.location)}
                  >
                    {loc.center} - {loc.location}
                  </button>
                ))}
              </div>
            )}

            <div className="bloodform-blood-types">
              <label className="bloodform-section-subtitle">Nhóm máu cần hiến</label>
              <div className="bloodform-blood-type-container">
                {!selectedLocation ? (
                  <div></div>
                ) : bloodGroups.length === 0 ? (
                  <div className="bloodform-empty-message">Chưa có nhóm máu cho địa điểm này</div>
                ) : (
                  bloodGroups.map((group) => (
                    <span
                      key={group}
                      className={`bloodform-blood-type type-${group.toLowerCase()}`}
                    >
                      {group}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bloodform-section">
            <h3 className="bloodform-section-title">
              Khung giờ hiến máu tại địa điểm đã chọn
            </h3>
            {!selectedLocation ? (
              <div className="bloodform-empty-message">Vui lòng chọn địa điểm trước</div>
            ) : selectedLocationTime && selectedLocationTime.timeSlots ? (
              <div className="bloodform-time-slots">
                {selectedLocationTime.timeSlots.map(slot => (
              <button
                key={slot.id}
                type="button"
                className={`bloodform-time-slot ${timeSelected === slot.id ? 'selected' : ''}`}
                onClick={() => setTimeSelected(slot.id)}
              >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bloodform-empty-message">Không có khung giờ nào cho địa điểm này</div>
            )}
          </div>
          <div className='button-submit'>
            <Link to={canContinue ? "/blood-registration2" : "#"}>
              <button
                className="button-style"
                onClick={(e) => {
                  if (!canContinue) {
                    e.preventDefault();
                    toast.error("Vui lòng chọn đầy thông tin!");
                  }
                }}
              >
                Tiếp tục
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}