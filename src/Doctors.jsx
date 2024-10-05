import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
// import './DoctorListing.css';

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorList);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctor-listing">
      <h2>Our Doctors</h2>
      <div className="doctor-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctor.imageUrl} alt={doctor.name} className="doctor-image" />
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <p>{doctor.experience} years experience</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorListing;