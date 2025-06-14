import { Router } from 'express';
import { getDb } from '../database/init';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/tasks
router.get('/', (req: AuthRequest, res) => {
  const userId = req.userId;
  const db = getDb();

  db.all(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      res.json(tasks);
    }
  );
});

// POST /api/tasks
router.post('/', (req: AuthRequest, res) => {
  const userId = req.userId;
  const { title, description, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const db = getDb();

  db.run(
    `INSERT INTO tasks (user_id, title, description, due_date) 
     VALUES (?, ?, ?, ?)`,
    [userId, title, description || null, due_date || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create task' });
      }

      const taskId = this.lastID;
      
      db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId],
        (err, task) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch created task' });
          }
          res.status(201).json(task);
        }
      );
    }
  );
});

// PUT /api/tasks/:id
router.put('/:id', (req: AuthRequest, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  const { title, description, completed, due_date } = req.body;

  const db = getDb();

  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];

  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  if (due_date !== undefined) {
    updates.push('due_date = ?');
    values.push(due_date);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(taskId, userId);

  db.run(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update task' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId],
        (err, task) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch updated task' });
          }
          res.json(task);
        }
      );
    }
  );
});

// DELETE /api/tasks/:id
router.delete('/:id', (req: AuthRequest, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  const db = getDb();

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete task' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    }
  );
});

export default router;