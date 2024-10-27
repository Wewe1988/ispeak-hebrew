import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Class,
  School,
  Timer,
  Assignment,
  Info,
} from '@mui/icons-material';

type StudentInfo = {
  name: string;
  class: string;
  teacher: string;
};

type WelcomeProps = {
  onStartExam: (info: StudentInfo) => void;
};

const Welcome: React.FC<WelcomeProps> = ({ onStartExam }) => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    class: '',
    teacher: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartExam(studentInfo);
  };

  const handleChange = (field: keyof StudentInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStudentInfo({ ...studentInfo, [field]: e.target.value });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          iSpeak - עברית מדוברת
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            טופס כניסה למבחן
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="שם מלא"
              value={studentInfo.name}
              onChange={handleChange('name')}
              margin="normal"
              required
              dir="rtl"
            />
            <TextField
              fullWidth
              label="כיתה"
              value={studentInfo.class}
              onChange={handleChange('class')}
              margin="normal"
              required
              dir="rtl"
            />
            <TextField
              fullWidth
              label="מורה מלמד"
              value={studentInfo.teacher}
              onChange={handleChange('teacher')}
              margin="normal"
              required
              dir="rtl"
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!studentInfo.name || !studentInfo.class || !studentInfo.teacher}
              >
                התחל מבחן
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/teacher')}
              >
                כניסת מורה
              </Button>
            </Box>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            מבנה המבחן:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText primary="משך המבחן: 30 דקות" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText
                primary="שלושה פרקים:"
                secondary={
                  <>
                    • פרק ראשון: הצגה עצמית (35 נקודות)
                    <br />
                    • פרק שני: הבעת דעה (35 נקודות)
                    <br />
                    • פרק שלישי: סרטון (30 נקודות)
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary="בכל שאלה אפשר להקליט שני מקטעים של עד 50 שניות כל אחד" />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Welcome;