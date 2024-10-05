import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
// import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "medicalRecords"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const recordList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(recordList);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="medical-records">
      <h2>Medical Records</h2>
      <div className="records-list">
        {records.map(record => (
          <div key={record.id} className="record-item">
            <h3>{record.type}</h3>
            <p>Date: {record.date}</p>
            <p>Doctor: {record.doctor}</p>
            <p>Notes: {record.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords;