// src/components/teacher/QuestionEditor.tsx
import React from 'react';
import { Box, TextField } from '@mui/material';

interface QuestionEditorProps {
  sectionType: 'self-introduction' | 'opinion' | 'video';
  title: string;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ sectionType, title }) => {
  return (
    <Box>
      {/* כאן יהיה תוכן הקומפוננטה */}
      <TextField
        fullWidth
        label={title}
        dir="rtl"
      />
    </Box>
  );
};