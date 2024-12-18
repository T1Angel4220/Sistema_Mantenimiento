import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos predeterminados de react-calendar

export function CalendarComponent({ selectedDate, onSelect }) {
  const [value, setValue] = useState(selectedDate || new Date());

  const handleDateChange = (date) => {
    setValue(date);
    if (onSelect) onSelect(date);
  };

  return (
    <div className="calendar-container">
      <Calendar onChange={handleDateChange} value={value} />
    </div>
  );
}
