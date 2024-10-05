import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Appointment.css';


const AppointmentBookingComponent = () => {
  const [appointment, setAppointment] = useState({
    doctorName: '',
    date: '',
    time: '',
    reason: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    fetchDoctors();

    return () => unsubscribe();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book an appointment.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        ...appointment,
        userId: user.uid,
        createdAt: new Date()
      });
      alert('Appointment booked successfully!');
      console.log('Appointment booked with ID:', docRef.id);
      setAppointment({ doctorName: '', date: '', time: '', reason: '' });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return <div className="appointment-loading">Loading...</div>;
  }

  return (
    <div className="appointment-container">
      <div className="appointment-card">
        <h2 className="appointment-title">Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label className="form-label">Doctor's Name:</label>
            <select
              name="doctorName"
              value={appointment.doctorName}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time:</label>
            <input
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Appointment:</label>
            <textarea
              name="reason"
              value={appointment.reason}
              onChange={handleChange}
              required
              className="form-input form-textarea"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingComponent;