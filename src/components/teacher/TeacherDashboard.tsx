// src/components/teacher/TeacherDashboard.tsx
import React from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import { QuestionEditor } from './QuestionEditor';
import { VideoSection } from './VideoSection';

export const TeacherDashboard: React.FC = () => {  // הוספנו export
  const [selectedSection, setSelectedSection] = React.useState(0);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          ניהול מבחן
        </Typography>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={selectedSection}
            onChange={(_, newValue) => setSelectedSection(newValue)}
            dir="rtl"
          >
            <Tab label="הצגה עצמית" />
            <Tab label="הבעת דעה" />
            <Tab label="שאלות על סרטון" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {selectedSection === 0 && (
              <QuestionEditor 
                sectionType="self-introduction"
                title="שאלות הצגה עצמית"
              />
            )}
            {selectedSection === 1 && (
              <QuestionEditor 
                sectionType="opinion"
                title="שאלות הבעת דעה"
              />
            )}
            {selectedSection === 2 && <VideoSection />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TeacherDashboard; // הוספנו export default