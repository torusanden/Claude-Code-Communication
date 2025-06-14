import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ScoreDisplayProps {
  score: number;
  weeklyRate: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, weeklyRate }) => {
  const getScoreColor = () => {
    if (score >= 80) return '#4caf50'; // 緑
    if (score >= 60) return '#ff9800'; // 黄
    return '#f44336'; // 赤
  };

  const getScoreText = () => {
    if (score >= 80) return '素晴らしい！';
    if (score >= 60) return '良い調子！';
    return '頑張りましょう！';
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        textAlign: 'center',
        border: `3px solid ${getScoreColor()}`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        自己肯定感スコア
      </Typography>
      <Typography
        variant="h1"
        sx={{
          color: getScoreColor(),
          fontWeight: 'bold',
          fontSize: '80px',
          lineHeight: 1,
          my: 2,
        }}
      >
        {score}
      </Typography>
      <Typography variant="h6" sx={{ color: getScoreColor(), mb: 3 }}>
        {getScoreText()}
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          週間達成率: {weeklyRate}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={weeklyRate}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              bgcolor: weeklyRate >= 80 ? '#4caf50' : weeklyRate >= 60 ? '#ff9800' : '#f44336',
            },
          }}
        />
      </Box>
    </Box>
  );
};