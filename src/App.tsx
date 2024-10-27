// src/App.tsx
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Welcome from './components/Welcome';
import Exam from './components/Exam';
import { TeacherDashboard } from './components/teacher';
import { db, auth } from './firebase/config';

type StudentInfo = {
  name: string;
  class: string;
  teacher: string;
};

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Assistant, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  const handleStartExam = (info: StudentInfo) => {
    setStudentInfo(info);
    setExamStarted(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              examStarted && studentInfo ? (
                <Exam studentInfo={studentInfo} />
              ) : (
                <Welcome onStartExam={handleStartExam} />
              )
            } 
          />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;