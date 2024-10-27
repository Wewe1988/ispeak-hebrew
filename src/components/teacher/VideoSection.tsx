// src/components/teacher/VideoSection.tsx
import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { QuestionEditor } from './QuestionEditor';

export const VideoSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');

  return (
    <Box>
      <TextField
        fullWidth
        label="קישור לסרטון YouTube"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        dir="rtl"
        sx={{ mb: 4 }}
      />
      
      <QuestionEditor
        sectionType="video"
        title="שאלות על הסרטון"
      />
    </Box>
  );
};