import React, { useState } from 'react';
import Navbar from '../assets/navbar';
import './BloodRegister.css'

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

export default function BloodRegister() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('Hiến máu - 466 Nguyễn Thị Minh Khai');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('A');
  const [selectedTime, setSelectedTime] = useState('07:00 - 11:00');

  return (
    <>
    <Navbar />
    <div className="bloodform-container">
        <h2 className="bloodform-title">Đặt lịch hiến máu</h2>
        <div className='bloodform-body'>
          <div className='bloodform-body1'>
            <li>11</li>
            <li>22</li>
          </div>
          <div className='bloodform-body2'>
            <div className="bloodform-body-content">
              <h3 className="bloodform-day">Chọn ngày</h3>
              <WeeklyDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>

          <div className="bloodform-location">
            <h3 className="blooform-location-title">Chọn địa điểm hiến máu</h3>
            <label className="bloodform-location-ct1">Tỉnh/Thành phố</label>
            <select className="bloodform-location-select1">
              <option>Hồ Chí Minh</option>
            </select>

            <label className="bloodform-location-ct2">Địa điểm</label>
            <select className="bloodform-location-select2">
              <option>
                Hiến máu - 466 Nguyễn Thị Minh Khai (7g đến 11g)
              </option>
            </select>

            <label className="bloodform-type">Nhóm máu cần hiến</label>
            <div className="bloodform-">
              {['A', 'B', 'AB', 'O'].map((group) => (
                <button
                key={group}
                className={`bloodform-type-box ${
                  group === 'A'
                  ? 'bg-sky-500 text-white'
                  : group === 'B'
                  ? 'bg-yellow-400 text-white'
                  : group === 'AB'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
                }`}
                onClick={() => setSelectedBloodGroup(group)}
                >
                  Nhóm máu {group}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-blue-600 mb-2">
              Chọn khung giờ bạn sẽ đến hiến máu
            </h3>
              <div className="border rounded p-3 bg-gray-100">
                <p>Thời gian nhận hồ sơ</p>
                <p className="font-bold">{selectedTime}</p>
              </div>
            </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Tiếp tục
              </button>
          </div>  
      </div>
    </div>
    </>
  );
}
