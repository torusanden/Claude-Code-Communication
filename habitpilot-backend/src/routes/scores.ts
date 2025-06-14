import { Router } from 'express';
import { getDb } from '../database/init';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Helper function to calculate daily score
const calculateDailyScore = (tasksCompleted: number, totalTasks: number): number => {
  if (totalTasks === 0) return 0;
  return Math.round((tasksCompleted / totalTasks) * 100);
};

// GET /api/scores/daily
router.get('/daily', (req: AuthRequest, res) => {
  const userId = req.userId;
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const db = getDb();

  // Get task statistics for the day
  db.get(
    `SELECT 
      COUNT(*) as total_tasks,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as tasks_completed
     FROM tasks 
     WHERE user_id = ? AND DATE(created_at) <= DATE(?)`,
    [userId, date],
    (err, stats: any) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to calculate score' });
      }

      const score = calculateDailyScore(stats.tasks_completed, stats.total_tasks);

      // Update or insert daily score
      db.run(
        `INSERT OR REPLACE INTO daily_scores 
         (user_id, date, score, tasks_completed, total_tasks) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, date, score, stats.tasks_completed, stats.total_tasks],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to save score' });
          }

          res.json({
            date,
            score,
            tasksCompleted: stats.tasks_completed,
            totalTasks: stats.total_tasks
          });
        }
      );
    }
  );
});

// GET /api/scores/weekly
router.get('/weekly', (req: AuthRequest, res) => {
  const userId = req.userId;
  const db = getDb();

  // Get scores for the last 7 days
  db.all(
    `SELECT 
      date,
      score,
      tasks_completed as tasksCompleted,
      total_tasks as totalTasks
     FROM daily_scores 
     WHERE user_id = ? 
     AND date >= DATE('now', '-7 days')
     ORDER BY date DESC`,
    [userId],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch weekly scores' });
      }

      // Calculate weekly average
      const totalScore = scores.reduce((sum: number, day: any) => sum + day.score, 0);
      const averageScore = scores.length > 0 ? Math.round(totalScore / scores.length) : 0;

      res.json({
        weeklyAverage: averageScore,
        dailyScores: scores
      });
    }
  );
});

// GET /api/scores/monthly
router.get('/monthly', (req: AuthRequest, res) => {
  const userId = req.userId;
  const db = getDb();

  // Get scores for the last 30 days
  db.all(
    `SELECT 
      date,
      score,
      tasks_completed as tasksCompleted,
      total_tasks as totalTasks
     FROM daily_scores 
     WHERE user_id = ? 
     AND date >= DATE('now', '-30 days')
     ORDER BY date DESC`,
    [userId],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch monthly scores' });
      }

      // Calculate monthly statistics
      const totalScore = scores.reduce((sum: number, day: any) => sum + day.score, 0);
      const averageScore = scores.length > 0 ? Math.round(totalScore / scores.length) : 0;
      const perfectDays = scores.filter((day: any) => day.score === 100).length;

      res.json({
        monthlyAverage: averageScore,
        perfectDays,
        totalDays: scores.length,
        dailyScores: scores
      });
    }
  );
});

export default router;