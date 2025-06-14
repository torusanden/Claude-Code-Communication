import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface TaskFormProps {
  onAdd: (taskName: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [taskName, setTaskName] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputTime, setInputTime] = useState(0);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setInputTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAdd(taskName.trim());
      setTaskName('');
      setStartTime(null);
      setInputTime(0);
    }
  };

  const handleFocus = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        °WD¿¹¯’ý 
      </Typography>
      {startTime && (
        <Typography variant="caption" color={inputTime > 60 ? 'error' : 'success.main'}>
          e›B“: {inputTime}Ò
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onFocus={handleFocus}
          placeholder="¿¹¯’e›"
          variant="outlined"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!taskName.trim()}
          sx={{ minWidth: 100 }}
        >
          ý 
        </Button>
      </Box>
    </Box>
  );
};