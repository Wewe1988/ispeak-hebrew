import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Paper,
  Button,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AudioRecorder from './AudioRecorder';  // הוספנו את היבוא

interface StudentInfoType {
  name: string;
  class: string;
  teacher: string;
}

export interface ExamProps {
  studentInfo: StudentInfoType;
}

interface Question {
  id: number;
  text: string;
  points: number;
}

const questions: Question[] = [
  { id: 1, text: 'ספר/י על עצמך ועל המשפחה שלך', points: 35 },
  { id: 2, text: 'מה דעתך על הנושא של למידה מרחוק?', points: 35 },
  { id: 3, text: 'צפה בסרטון וענה על השאלה...', points: 30 }
];

const Exam: React.FC<ExamProps> = ({ studentInfo }) => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRecordingComplete = (audioBlob: Blob, questionId: number) => {
    setRecordings(prev => ({
      ...prev,
      [questionId]: audioBlob
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const QuestionIndicator = ({ questionNumber, isCurrent, isCompleted }: 
    { questionNumber: number; isCurrent: boolean; isCompleted: boolean }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 1,
      color: isCurrent ? 'primary.main' : isCompleted ? 'success.main' : 'text.secondary'
    }}>
      {isCompleted ? (
        <CheckCircleIcon sx={{ fontSize: 24 }} />
      ) : (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%',
          border: '2px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isCurrent ? 'primary.main' : 'text.disabled'
        }}>
          {questionNumber}
        </Box>
      )}
      <Typography>
        שאלה {questionNumber}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2
          }}>
            <Typography>זמן נותר: {formatTime(timeLeft)}</Typography>
            <Typography>שאלה {currentQuestion + 1} מתוך {questions.length}</Typography>
          </Box>

          {/* Progress Indicators */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 4,
            position: 'relative'
          }}>
            {/* קו מחבר בין האינדיקטורים */}
            <Box sx={{
              position: 'absolute',
              top: '12px',
              left: '10%',
              right: '10%',
              height: '2px',
              bgcolor: 'divider',
              zIndex: 0
            }} />

            {questions.map((_, index) => (
              <QuestionIndicator
                key={index}
                questionNumber={index + 1}
                isCurrent={currentQuestion === index}
                isCompleted={Boolean(recordings[index + 1])}
              />
            ))}
          </Box>

          {/* Question */}
          <Box sx={{ mb: 4, textAlign: 'right' }}>
            <Typography variant="h5" gutterBottom>
              {questions[currentQuestion].text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (ניקוד {questions[currentQuestion].points})
            </Typography>
          </Box>

          {/* Recorder */}
          <AudioRecorder
            key={currentQuestion}
            maxDuration={50}
            maxSegments={2}
            questionId={questions[currentQuestion].id}
            onRecordingComplete={(blob: Blob) => handleRecordingComplete(blob, questions[currentQuestion].id)}
          />

          {/* Navigation */}
          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2
          }}>
            <Button 
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              variant="outlined"
            >
              שאלה קודמת
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestion === questions.length - 1 || !recordings[questions[currentQuestion].id]}
              variant="contained"
            >
              שאלה הבאה
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Exam;