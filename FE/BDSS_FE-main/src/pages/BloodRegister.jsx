import React, { use, useEffect, useState } from 'react';
import Navbar from '../assets/navbar';
import './BloodRegister.css'
import bloodDonationSchedules from '../assets/donationSchedule';
import { Link } from 'react-router';
import Footer from '../assets/footer';
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setHours(-24 * (day - 1));
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
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));

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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" onClick={handlePrevWeek}>{'<'}</button>
      {weekDays.map((day) => {
        const value = day.toISOString().split('T')[0];
        return (
          <button
            key={value}
            type="button"
            style={{
              padding: 8,
              borderRadius: 6,
              border: value === selectedDate ? '2px solid #1976d2' : '1px solid #ccc',
              background: value === selectedDate ? '#1976d2' : '#fff',
              color: value === selectedDate ? '#fff' : '#222',
              cursor: 'pointer',
              minWidth: 48,
            }}
            onClick={() => onChange(value)}
          >
            {day.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </button>
        );
      })}
      <button type="button" onClick={handleNextWeek}>{'>'}</button>
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

export default function BloodRegister() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('');
  useEffect(() => {
    setSelectedLocation('')
  }, [selectedDate])

  useEffect(() => {
    setTimeSelected(false);
  }, [selectedLocation]);
  const bloodGroups = getBloodGroup(selectedLocation);
  const locations = bloodDonationSchedules.filter(
    (item) => item.date === selectedDate
  );
  const selectedLocationTime = locations.find(
    (loc) => loc.location === selectedLocation
  );
  const [timeSelected, setTimeSelected] = useState(false);
  const startTime = selectedLocationTime ? selectedLocationTime.startTime : '';
  const endTime = selectedLocationTime ? selectedLocationTime.endTime : '';
  return (
    <>
    <Navbar />
    <div className="bloodform-container">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"></link>
        <h2 className="bloodform-title">Đặt lịch hiến máu</h2>
        <div className='bloodform-body'>
          <div className='bloodform-body1'>
            <p className='step1'><i className="bi bi-check-square"></i>Thời gian & Địa điểm</p>
            <p className='step2-icon'>Phiếu đăng ký hiến máu</p>
          </div>
          <div className='bloodform-body2'>
            <div className="bloodform-body-content">
              <h3 className="bloodform-day">Chọn ngày</h3>
              <WeeklyDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>

          <div className="bloodform-location">
            <h3 className="blooform-location-title">Địa điểm hiến máu hiện có</h3>
                {locations.length === 0 ? (
                  <div>Không có địa điểm hiến máu cho ngày này</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {locations.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`bloodform-location-btn${selectedLocation === loc.location ? ' selected' : ''}`}
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          border: selectedLocation === loc.location ? '2px solid #1976d2' : '1px solid #ccc',
                          background: selectedLocation === loc.location ? '#1976d2' : '#fff',
                          color: selectedLocation === loc.location ? '#fff' : '#222',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onClick={() => setSelectedLocation(loc.location)}
                      >
                        {loc.center} - {loc.location}
                      </button>
                    ))}
                  </div>
                )}

            <label className="bloodform-type">Nhóm máu cần hiến</label>
            <div className="bloodform-type-show">
              {!selectedLocation ? (
                <div></div>
              ) : bloodGroups.length === 0 ? (
                <div>Chưa có nhóm máu cho địa điểm này</div>
              ) : (
                bloodGroups.map((group) => (
                  <span
                    key={group}
                    className={`bloodform-type-box ${group.toLowerCase()}`}
                  >
                    {group}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="bloodform-time">
            <h3 className="selected-time">
              Chọn khung giờ bạn sẽ đến hiến máu
            </h3>
            {selectedLocation && (
              <button
              className={`bloodform-time-box${timeSelected ? ' selected' : ''}`}
              type="button"
              onClick={() => setTimeSelected(true)}
              >
                {startTime && endTime ? `${startTime} - ${endTime}` : 'Chọn khung giờ'}
              </button>
              )}
            </div>
              <Link to="/blood-registration2">
                <button className="button-style">
                  Tiếp tục
                </button>
              </Link>
          </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
