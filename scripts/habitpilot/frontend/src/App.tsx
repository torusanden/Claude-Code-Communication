import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ScoreDisplay } from './components/ScoreDisplay';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // LocalStorageから読み込み
  useEffect(() => {
    const savedTasks = localStorage.getItem('habitpilot_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // LocalStorageに保存
  useEffect(() => {
    localStorage.setItem('habitpilot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // スコア計算
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const selfEsteemScore = Math.min(100, Math.round(completionRate * 0.8 + (completedCount * 5)));

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196F3',
      },
      success: {
        main: '#4CAF50',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196F3' }}>
            HabitPilot
          </Typography>
          <Typography variant="h6" color="text.secondary">
            できない自分を、できる自分に変える
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TaskForm onAdd={handleAddTask} />
            <ScoreDisplay score={selfEsteemScore} weeklyRate={completionRate} />
          </Box>
          <Box>
            <TaskList tasks={tasks} onToggle={handleToggleTask} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;