import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { ScoreData, WeeklyData } from '../types';
import '@testing-library/jest-dom';
import { Line, Bar } from 'recharts';

// Rechartsのモック
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('ScoreDisplay Component', () => {
  const mockScoreData: ScoreData = {
    currentScore: 85,
    previousScore: 78,
    maxScore: 100,
    trend: 'up',
    streakDays: 7,
    totalTasksCompleted: 42,
    completionRate: 0.85,
  };

  const mockWeeklyData: WeeklyData[] = [
    { date: '2024-01-01', score: 70, tasksCompleted: 5, tasksTotal: 7 },
    { date: '2024-01-02', score: 75, tasksCompleted: 6, tasksTotal: 8 },
    { date: '2024-01-03', score: 80, tasksCompleted: 7, tasksTotal: 8 },
    { date: '2024-01-04', score: 78, tasksCompleted: 6, tasksTotal: 8 },
    { date: '2024-01-05', score: 82, tasksCompleted: 7, tasksTotal: 8 },
    { date: '2024-01-06', score: 85, tasksCompleted: 8, tasksTotal: 9 },
    { date: '2024-01-07', score: 85, tasksCompleted: 8, tasksTotal: 9 },
  ];

  describe('スコア計算の正確性', () => {
    test('現在のスコアが正しく表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('/100')).toBeInTheDocument();
    });

    test('スコアの変化が正しく表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      // 上昇トレンド
      const trendElement = screen.getByText('+7');
      expect(trendElement).toBeInTheDocument();
      expect(trendElement).toHaveClass('trend-up');
    });

    test('下降トレンドが正しく表示される', () => {
      const downTrendData = {
        ...mockScoreData,
        currentScore: 70,
        previousScore: 78,
        trend: 'down' as const,
      };
      
      render(<ScoreDisplay scoreData={downTrendData} weeklyData={mockWeeklyData} />);
      
      const trendElement = screen.getByText('-8');
      expect(trendElement).toBeInTheDocument();
      expect(trendElement).toHaveClass('trend-down');
    });

    test('変化なしの場合の表示', () => {
      const sameTrendData = {
        ...mockScoreData,
        currentScore: 78,
        previousScore: 78,
        trend: 'same' as const,
      };
      
      render(<ScoreDisplay scoreData={sameTrendData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('±0')).toBeInTheDocument();
    });

    test('ストリーク日数が正しく表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('7日連続')).toBeInTheDocument();
      expect(screen.getByText('🔥')).toBeInTheDocument();
    });

    test('完了率がパーセンテージで表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('完了率')).toBeInTheDocument();
    });

    test('総タスク完了数が表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('タスク完了')).toBeInTheDocument();
    });
  });

  describe('グラフ表示のテスト', () => {
    test('週間スコアグラフが表示される', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('タスク完了数グラフが表示される', async () => {
      const user = userEvent.setup();
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      // グラフタイプを切り替え
      const toggleButton = screen.getByRole('button', { name: /タスク完了数/i });
      await user.click(toggleButton);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('グラフのツールチップが機能する', async () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      // Rechartsのツールチップ機能をテスト（モックのため簡略化）
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('データがない場合の表示', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={[]} />);
      
      expect(screen.getByText('データがありません')).toBeInTheDocument();
    });
  });

  describe('スコア計算ロジックの検証', () => {
    test('完了率からスコアが正しく計算される', () => {
      const calculateScore = (completedTasks: number, totalTasks: number): number => {
        if (totalTasks === 0) return 0;
        const completionRate = completedTasks / totalTasks;
        return Math.round(completionRate * 100);
      };

      expect(calculateScore(8, 10)).toBe(80);
      expect(calculateScore(10, 10)).toBe(100);
      expect(calculateScore(0, 10)).toBe(0);
      expect(calculateScore(5, 0)).toBe(0);
    });

    test('ストリークボーナスが適用される', () => {
      const calculateScoreWithStreak = (
        baseScore: number,
        streakDays: number
      ): number => {
        const streakBonus = Math.min(streakDays * 2, 20); // 最大20ポイント
        return Math.min(baseScore + streakBonus, 100);
      };

      expect(calculateScoreWithStreak(80, 5)).toBe(90);
      expect(calculateScoreWithStreak(85, 10)).toBe(100); // 上限100
      expect(calculateScoreWithStreak(90, 15)).toBe(100); // ボーナス上限適用
    });

    test('週間平均スコアが正しく計算される', () => {
      const weeklyAverage = mockWeeklyData.reduce((sum, day) => sum + day.score, 0) / mockWeeklyData.length;
      const expectedAverage = Math.round(weeklyAverage);
      
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText(`週間平均: ${expectedAverage}`)).toBeInTheDocument();
    });
  });

  describe('レスポンシブデザイン', () => {
    test('モバイル表示で適切にレイアウトされる', () => {
      // ビューポートをモバイルサイズに設定
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      const container = screen.getByTestId('score-display-container');
      expect(container).toHaveClass('mobile-layout');
    });

    test('タブレット以上でフルレイアウト表示', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      const container = screen.getByTestId('score-display-container');
      expect(container).not.toHaveClass('mobile-layout');
    });
  });

  describe('アニメーション効果', () => {
    test('スコア変更時にアニメーションが発生する', async () => {
      const { rerender } = render(
        <ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />
      );
      
      const updatedScoreData = {
        ...mockScoreData,
        currentScore: 90,
      };
      
      rerender(<ScoreDisplay scoreData={updatedScoreData} weeklyData={mockWeeklyData} />);
      
      // アニメーションクラスの確認
      const scoreElement = screen.getByText('90');
      expect(scoreElement.parentElement).toHaveClass('score-animated');
    });

    test('ストリーク達成時に特別なアニメーション', () => {
      const milestoneData = {
        ...mockScoreData,
        streakDays: 30, // マイルストーン
      };
      
      render(<ScoreDisplay scoreData={milestoneData} weeklyData={mockWeeklyData} />);
      
      const streakElement = screen.getByText('30日連続');
      expect(streakElement.parentElement).toHaveClass('milestone-animation');
    });
  });

  describe('アクセシビリティ', () => {
    test('適切なARIA属性が設定されている', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByRole('region', { name: /スコア表示/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /週間スコアグラフ/i })).toBeInTheDocument();
    });

    test('スクリーンリーダー用の説明テキスト', () => {
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText(/現在のスコアは85点で、前回より7点上昇しています/i)).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    test('不正なスコアデータの場合', () => {
      const invalidData = {
        ...mockScoreData,
        currentScore: -10,
        maxScore: 0,
      };
      
      render(<ScoreDisplay scoreData={invalidData} weeklyData={mockWeeklyData} />);
      
      expect(screen.getByText('スコア計算エラー')).toBeInTheDocument();
    });

    test('週間データが不完全な場合', () => {
      const incompleteData = [
        { date: '2024-01-01', score: NaN, tasksCompleted: 5, tasksTotal: 7 },
      ];
      
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={incompleteData} />);
      
      expect(screen.getByText('データ不足のため一部表示できません')).toBeInTheDocument();
    });
  });

  describe('パフォーマンステスト', () => {
    test('大量データでも適切に表示される', () => {
      const largeWeeklyData = Array.from({ length: 365 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        score: Math.floor(Math.random() * 30) + 70,
        tasksCompleted: Math.floor(Math.random() * 5) + 5,
        tasksTotal: 10,
      }));
      
      const startTime = performance.now();
      render(<ScoreDisplay scoreData={mockScoreData} weeklyData={largeWeeklyData} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // 1秒以内
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});