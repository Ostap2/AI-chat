import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [shouldReopenModal, setShouldReopenModal] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= lastDay; i++) {
      daysArray.push({ day: i, month: date.toLocaleString('en-US', { month: 'long' }) });
    }

    return daysArray;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
    setSelectedDay(null);
  };

  const closeAndReopenModal = () => {
    closeModal();
    setShouldReopenModal(true);
  };

  const handleDayClick = (day) => {
    const dayElement = document.getElementById(`day-${day.day}`);
    
    if (!dayElement) {
      console.error(`Element with id 'day-${day.day}' not found.`);
      return;
    }
  
    const dayElementRect = dayElement.getBoundingClientRect();
    const modalWidth = 292;
    const modalHeight = 188;
  
    const modalTop = dayElementRect.top - modalHeight - 40; 
    const modalLeft = dayElementRect.left + dayElementRect.width / 2 - modalWidth / 2;
  
    if (selectedDay === day.day) {
      closeAndReopenModal();
    } else {
      setSelectedDay(day.day);
      setModalContent(day);

      document.documentElement.style.setProperty('--modal-top', `${modalTop}px`);
      document.documentElement.style.setProperty('--modal-left', `${modalLeft}px`);
      
      if (shouldReopenModal) {
        setIsModalOpen(true);
        setShouldReopenModal(false);
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const handleOutsideClick = (event) => {
    const isDayClicked = event.target.classList.contains('day');
  
    if (!isDayClicked) {
      closeModal();
    }
  };
  

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="calendar">
      <div className="header">
        <div className="right-align">
          <button onClick={handlePrevMonth} className='button'>&lt;</button>
          <h2 className='month-title'>
            {currentDate.toLocaleString('en-US', { month: 'long' })}, {currentDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className='button'>&gt;</button>
        </div>
      </div>
      <div className="days">
        {getDaysInMonth(currentDate).map((day) => (
          <div key={day.day} id={`day-${day.day}`}>
            <div
              className={`day ${selectedDay === day.day ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day.day}
            </div>
            <h1 className='procent'>100%</h1>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <div className='container'>
              <span className="close" onClick={closeModal}>&times;</span>
              <h1 className='title-modal'>{`${modalContent.day}, ${modalContent.month}`}</h1>
              <p className='modal-paragraf'>Daily norm: <span className='span-modal'>1.5L</span></p>
              <p className='modal-paragraf'>Fulfillment of the daily norm: <span className='span-modal'>100%</span></p>
              <p className='modal-paragraf'>How many servings of water: <span className='span-modal'>6</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Calendar />
    </div>
  );
}

export default App;
