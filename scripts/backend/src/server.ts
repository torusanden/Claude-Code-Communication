import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// ミドルウェア設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// インメモリデータストア（MVP用）
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

let tasks: Task[] = [
  {
    id: '1',
    title: '朝のストレッチ',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '読書30分',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let currentScore = 0;

// スコア計算関数
const calculateScore = (): number => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  
  if (totalTasks === 0) return 0;
  
  const completionRate = completedTasks / totalTasks;
  return Math.round(completionRate * 100);
};

// ルート定義

// ヘルスチェック
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// スコア取得
app.get('/api/score', (req: Request, res: Response) => {
  currentScore = calculateScore();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  
  res.json({
    score: currentScore,
    completedTasks,
    totalTasks,
    streak: 0, // MVP版では0固定
    lastUpdated: new Date().toISOString()
  });
});

// タスク一覧取得
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

// タスク追加
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'タスク名は必須です' });
  }
  
  const newTask: Task = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json(newTask);
});

// タスク更新（完了/未完了の切り替え）
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed, title } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'タスクが見つかりません' });
  }
  
  // 更新
  if (typeof completed === 'boolean') {
    tasks[taskIndex].completed = completed;
  }
  
  if (title && typeof title === 'string' && title.trim() !== '') {
    tasks[taskIndex].title = title.trim();
  }
  
  res.json(tasks[taskIndex]);
});

// タスク削除（オプション）
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'タスクが見つかりません' });
  }
  
  res.status(204).send();
});

// 404ハンドラー
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'エンドポイントが見つかりません' });
});

// エラーハンドラー
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('サーバーエラー:', err);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log('📋 利用可能なエンドポイント:');
  console.log('  GET  /api/health   - ヘルスチェック');
  console.log('  GET  /api/score    - スコア取得');
  console.log('  GET  /api/tasks    - タスク一覧');
  console.log('  POST /api/tasks    - タスク追加');
  console.log('  PUT  /api/tasks/:id - タスク更新');
  console.log('  DELETE /api/tasks/:id - タスク削除');
});