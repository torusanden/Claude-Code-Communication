import React from 'react';
import { Box, Checkbox, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => {
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        タスク一覧 ({completedCount}/{tasks.length} 完了)
      </Typography>
      {tasks.length === 0 ? (
        <Typography color="text.secondary">タスクがありません</Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                bgcolor: task.completed ? '#e8f5e9' : 'white',
                mb: 1,
                borderRadius: 1,
                transition: 'all 0.3s'
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  sx={{
                    color: task.completed ? '#4caf50' : 'default',
                    '&.Mui-checked': {
                      color: '#4caf50',
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.name}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};