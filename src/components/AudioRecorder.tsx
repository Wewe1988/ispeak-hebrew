import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  IconButton,
  LinearProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface AudioRecorderProps {
  maxDuration: number;
  maxSegments: number;
  questionId: number;
  onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  maxDuration,
  maxSegments,
  questionId,
  onRecordingComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [segments, setSegments] = useState<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      cleanupAudio();
    };
  }, [questionId]);

  const cleanupAudio = () => {
    if (combinedAudioUrl) {
      URL.revokeObjectURL(combinedAudioUrl);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const newSegments = [...segments, audioBlob];
        setSegments(newSegments);
        
        // יצירת הקלטה משולבת
        if (newSegments.length > 0) {
          const combinedBlob = new Blob(newSegments, { type: 'audio/wav' });
          const url = URL.createObjectURL(combinedBlob);
          if (combinedAudioUrl) {
            URL.revokeObjectURL(combinedAudioUrl);
          }
          setCombinedAudioUrl(url);
          onRecordingComplete(combinedBlob);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playSegment = (index: number) => {
    if (currentPlayingIndex === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(segments[index]);
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentPlayingIndex(index);
      }
    }
  };

  const playCombined = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else if (audioRef.current && combinedAudioUrl) {
      audioRef.current.src = combinedAudioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentPlayingIndex(null);
    }
  };

  const deleteSegment = (index: number) => {
    setSegments(prev => {
      const newSegments = prev.filter((_, i) => i !== index);
      
      // עדכון ההקלטה המשולבת
      if (newSegments.length > 0) {
        const combinedBlob = new Blob(newSegments, { type: 'audio/wav' });
        const url = URL.createObjectURL(combinedBlob);
        if (combinedAudioUrl) {
          URL.revokeObjectURL(combinedAudioUrl);
        }
        setCombinedAudioUrl(url);
        onRecordingComplete(combinedBlob);
      } else {
        setCombinedAudioUrl(null);
      }
      
      return newSegments;
    });
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentPlayingIndex(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color={isRecording ? "error" : "primary"}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={segments.length >= maxSegments && !isRecording}
        >
          {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
        </Button>

        {combinedAudioUrl && (
          <Button
            variant="outlined"
            startIcon={isPlaying && currentPlayingIndex === null ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={playCombined}
          >
            הקלטה מלאה
          </Button>
        )}
      </Box>

      {isRecording && (
        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
          <Typography variant="body2" align="center" gutterBottom>
            מקליט... {recordingTime} / {maxDuration} שניות
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(recordingTime / maxDuration) * 100} 
          />
        </Box>
      )}

      {segments.map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            p: 1,
            bgcolor: 'grey.100',
            borderRadius: 1
          }}
        >
          <IconButton 
            onClick={() => playSegment(index)}
            color="primary"
            size="small"
          >
            {isPlaying && currentPlayingIndex === index ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <Typography variant="body2">
            מקטע {index + 1}
          </Typography>
          <IconButton 
            onClick={() => deleteSegment(index)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        מקטעי הקלטה: {segments.length} / {maxSegments}
      </Typography>
    </Box>
  );
};

export default AudioRecorder;