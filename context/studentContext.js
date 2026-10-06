// context/StudentContext.js
'use client'
import { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <StudentContext.Provider value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
