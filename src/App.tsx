// בראש App.tsx
import { db, auth } from './firebase/config';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Exam from './components/Exam';
import { TeacherDashboard } from './components/teacher';

// הגדרת ערכת נושא
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

// הגדרת טיפוס למידע של התלמיד
type StudentInfo = {
  name: string;
  class: string;
  teacher: string;
};

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  const handleStartExam = (info: StudentInfo) => {
    setStudentInfo(info);
    setExamStarted(true);
  };

  const StudentExamComponent = () => {
    return examStarted && studentInfo ? (
      <Exam studentInfo={studentInfo} />
    ) : (
      <Welcome onStartExam={handleStartExam} />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* נתיב ברירת מחדל למבחן תלמיד */}
          <Route path="/" element={<StudentExamComponent />} />
          
          {/* נתיב לממשק המורה */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          
          {/* הפניה מחדש לדף הבית עבור נתיבים לא קיימים */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;