import { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Grid, ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { motion } from 'framer-motion'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { ScoreDisplay } from './components/ScoreDisplay'

interface Task {
  id: string;
  title: string;
  category: string;
  frequency: string;
  targetTime?: string;
  completedToday: boolean;
  streak: number;
  totalCompletions: number;
  lastCompleted?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#FF9800',
      },
      success: {
        main: '#4CAF50',
        light: '#E8F5E9',
      },
    },
    typography: {
      fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('habitpilot_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedDarkMode = localStorage.getItem('habitpilot_darkmode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habitpilot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskName: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title: taskName,
      category: 'other',
      frequency: 'daily',
      completedToday: false,
      streak: 0,
      totalCompletions: 0,
    };
    setTasks([...tasks, task]);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompletedToday = !task.completedToday;
        return {
          ...task,
          completedToday: newCompletedToday,
          streak: newCompletedToday ? task.streak + 1 : Math.max(0, task.streak - 1),
          totalCompletions: newCompletedToday ? task.totalCompletions + 1 : task.totalCompletions,
          lastCompleted: newCompletedToday ? new Date().toISOString() : task.lastCompleted,
        };
      }
      return task;
    }));
  };


  const completedTasks = tasks.filter(task => task.completedToday).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const selfAffirmationScore = Math.round(
    tasks.reduce((sum, task) => sum + (task.completedToday ? 10 : 0) + (task.streak * 2), 0) / Math.max(1, tasks.length)
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={0} sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'transparent' }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HabitPilot
              </Typography>
              <Typography variant="h6" color="text.secondary">
                できない自分を、できる自分に変える
              </Typography>
            </Paper>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TaskForm onAdd={handleAddTask} />
              <Box mt={3}>
                <ScoreDisplay
                  score={selfAffirmationScore}
                  weeklyRate={Math.round(completionRate)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TaskList
                tasks={tasks.map(task => ({
                  id: task.id,
                  name: task.title,
                  completed: task.completedToday
                }))}
                onToggle={handleToggleComplete}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App