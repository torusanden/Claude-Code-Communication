import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../components/TaskList';
import { Task } from '../types';
import '@testing-library/jest-dom';

// モックデータ
const mockTasks: Task[] = [
  {
    id: '1',
    title: '朝のストレッチ',
    description: '10分間の全身ストレッチ',
    completed: false,
    completedAt: null,
    frequency: 'daily',
    reminderTime: '07:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: '読書30分',
    description: 'ビジネス書を読む',
    completed: true,
    completedAt: '2024-01-01T10:00:00Z',
    frequency: 'daily',
    reminderTime: '20:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    title: '週次レビュー',
    description: '今週の振り返りと来週の計画',
    completed: false,
    completedAt: null,
    frequency: 'weekly',
    reminderTime: '18:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('TaskList Component', () => {
  const mockOnToggleComplete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('タスク表示の正確性', () => {
    test('すべてのタスクが正しく表示される', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // すべてのタスクタイトルが表示される
      expect(screen.getByText('朝のストレッチ')).toBeInTheDocument();
      expect(screen.getByText('読書30分')).toBeInTheDocument();
      expect(screen.getByText('週次レビュー')).toBeInTheDocument();

      // タスクの説明も表示される
      expect(screen.getByText('10分間の全身ストレッチ')).toBeInTheDocument();
      expect(screen.getByText('ビジネス書を読む')).toBeInTheDocument();
    });

    test('タスクの頻度が正しく表示される', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const dailyTasks = screen.getAllByText('毎日');
      expect(dailyTasks).toHaveLength(2);
      expect(screen.getByText('毎週')).toBeInTheDocument();
    });

    test('リマインダー時間が正しく表示される', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('🔔 07:00')).toBeInTheDocument();
      expect(screen.getByText('🔔 20:00')).toBeInTheDocument();
      expect(screen.getByText('🔔 18:00')).toBeInTheDocument();
    });

    test('空のタスクリストの場合メッセージを表示', () => {
      render(
        <TaskList
          tasks={[]}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument();
    });

    test('完了済みタスクに適切なスタイルが適用される', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const completedTask = screen.getByText('読書30分').closest('.task-item');
      expect(completedTask).toHaveClass('completed');
      
      const incompleteTasks = [
        screen.getByText('朝のストレッチ').closest('.task-item'),
        screen.getByText('週次レビュー').closest('.task-item'),
      ];
      
      incompleteTasks.forEach(task => {
        expect(task).not.toHaveClass('completed');
      });
    });
  });

  describe('完了状態の切り替え', () => {
    test('チェックボックスクリックで完了状態を切り替える', async () => {
      const user = userEvent.setup();
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // 未完了タスクのチェックボックスをクリック
      const stretchCheckbox = screen.getByRole('checkbox', { name: /朝のストレッチ/i });
      expect(stretchCheckbox).not.toBeChecked();
      
      await user.click(stretchCheckbox);
      
      expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true);
    });

    test('完了済みタスクのチェックを外す', async () => {
      const user = userEvent.setup();
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // 完了済みタスクのチェックボックスをクリック
      const readingCheckbox = screen.getByRole('checkbox', { name: /読書30分/i });
      expect(readingCheckbox).toBeChecked();
      
      await user.click(readingCheckbox);
      
      expect(mockOnToggleComplete).toHaveBeenCalledWith('2', false);
    });

    test('完了時刻が正しく表示される', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // 完了済みタスクには完了時刻が表示される
      const completedTask = screen.getByText('読書30分').closest('.task-item');
      expect(within(completedTask!).getByText(/完了: 2024-01-01/)).toBeInTheDocument();
    });

    test('連続クリックでのデバウンス処理', async () => {
      const user = userEvent.setup();
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: /朝のストレッチ/i });
      
      // 素早く3回クリック
      await user.tripleClick(checkbox);
      
      // デバウンスにより1回のみ呼ばれる
      await waitFor(() => {
        expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('フィルタリングとソート', () => {
    test('完了済みタスクのみ表示', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          filter="completed"
        />
      );

      expect(screen.getByText('読書30分')).toBeInTheDocument();
      expect(screen.queryByText('朝のストレッチ')).not.toBeInTheDocument();
      expect(screen.queryByText('週次レビュー')).not.toBeInTheDocument();
    });

    test('未完了タスクのみ表示', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          filter="incomplete"
        />
      );

      expect(screen.getByText('朝のストレッチ')).toBeInTheDocument();
      expect(screen.getByText('週次レビュー')).toBeInTheDocument();
      expect(screen.queryByText('読書30分')).not.toBeInTheDocument();
    });

    test('頻度でフィルタリング', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          filterByFrequency="weekly"
        />
      );

      expect(screen.getByText('週次レビュー')).toBeInTheDocument();
      expect(screen.queryByText('朝のストレッチ')).not.toBeInTheDocument();
      expect(screen.queryByText('読書30分')).not.toBeInTheDocument();
    });

    test('作成日時でソート（新しい順）', () => {
      const sortedTasks = [...mockTasks].reverse();
      render(
        <TaskList
          tasks={sortedTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          sortBy="createdAt"
          sortOrder="desc"
        />
      );

      const taskTitles = screen.getAllByTestId('task-title').map(el => el.textContent);
      expect(taskTitles[0]).toBe('週次レビュー');
      expect(taskTitles[taskTitles.length - 1]).toBe('朝のストレッチ');
    });
  });

  describe('編集と削除機能', () => {
    test('編集ボタンクリックで編集コールバックが呼ばれる', async () => {
      const user = userEvent.setup();
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const firstTask = screen.getByText('朝のストレッチ').closest('.task-item');
      const editButton = within(firstTask!).getByRole('button', { name: /編集/i });
      
      await user.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
    });

    test('削除ボタンクリックで確認ダイアログが表示される', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn().mockReturnValue(true);
      
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const firstTask = screen.getByText('朝のストレッチ').closest('.task-item');
      const deleteButton = within(firstTask!).getByRole('button', { name: /削除/i });
      
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalledWith('このタスクを削除しますか？');
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    test('削除確認をキャンセルした場合は削除されない', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn().mockReturnValue(false);
      
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getAllByRole('button', { name: /削除/i })[0];
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('アクセシビリティ', () => {
    test('適切なARIA属性が設定されている', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const list = screen.getByRole('list', { name: /タスク一覧/i });
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('キーボードナビゲーションが機能する', async () => {
      const user = userEvent.setup();
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // 最初のチェックボックスにフォーカス
      const firstCheckbox = screen.getByRole('checkbox', { name: /朝のストレッチ/i });
      firstCheckbox.focus();
      
      // Spaceキーで切り替え
      await user.keyboard(' ');
      expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true);
    });

    test('スクリーンリーダー用の説明テキストが含まれる', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // 完了状態の説明
      expect(screen.getByText('(完了済み)')).toBeInTheDocument();
      
      // 頻度の説明
      const weeklyTask = screen.getByText('週次レビュー').closest('.task-item');
      expect(within(weeklyTask!).getByText('毎週')).toBeInTheDocument();
    });
  });

  describe('パフォーマンス', () => {
    test('大量のタスクでも適切に表示される', () => {
      const manyTasks = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        title: `タスク ${i + 1}`,
        description: `説明 ${i + 1}`,
        completed: i % 2 === 0,
        completedAt: i % 2 === 0 ? new Date().toISOString() : null,
        frequency: 'daily' as const,
        reminderTime: '09:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      render(
        <TaskList
          tasks={manyTasks}
          onToggleComplete={mockOnToggleComplete}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(100);
    });
  });
});