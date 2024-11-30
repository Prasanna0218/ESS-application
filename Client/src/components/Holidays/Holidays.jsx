import React from 'react';
import './Holidays.css';
import Navbar from '../Navbar/Navbar';

export default function Holidays() {
  return (
    <>
    <Navbar/>
    <div className="holidays-container">
      <h1 className="holidays-title">Holidays</h1>
      <ul className="holidays-list">
        <li><strong>January 14, Tuesday</strong> – Makar Sankranti</li>
        <li><strong>January 26, Sunday</strong> – Republic Day</li>
        <li><strong>March 17, Monday</strong> – Holi</li>
        <li><strong>April 14, Monday</strong> – Dr. Ambedkar Jayanti</li>
        <li><strong>April 18, Friday</strong> – Good Friday</li>
        <li><strong>May 31, Saturday</strong> – Eid al-Fitr</li>
        <li><strong>August 15, Friday</strong> – Independence Day</li>
        <li><strong>October 2, Thursday</strong> – Gandhi Jayanti</li>
        <li><strong>October 1, Wednesday</strong> – Dussehra</li>
        <li><strong>October 20, Monday</strong> – Diwali</li>
      </ul>
    </div>
    </>
  );
}
