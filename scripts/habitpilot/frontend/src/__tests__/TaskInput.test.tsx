import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskInput } from '../components/TaskInput';
import '@testing-library/jest-dom';

// モックタイマー
jest.useFakeTimers();

describe('TaskInput Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  describe('バリデーション', () => {
    test('空のタスク名では送信できない', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/タスク名を入力してください/i)).toBeInTheDocument();
    });

    test('タスク名が255文字を超える場合エラーを表示', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      const longText = 'a'.repeat(256);
      
      await user.type(input, longText);
      
      expect(screen.getByText(/タスク名は255文字以内で入力してください/i)).toBeInTheDocument();
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('スペースのみのタスク名は無効', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      await user.type(input, '   ');
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/タスク名を入力してください/i)).toBeInTheDocument();
    });

    test('特殊文字を含むタスク名も許可される', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      const specialCharsTask = '📚 読書 & 勉強 <30分>';
      
      await user.type(input, specialCharsTask);
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: specialCharsTask,
      }));
    });
  });

  describe('1分以内の入力完了', () => {
    test('入力開始から60秒のカウントダウンを表示', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} showTimer={true} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      
      // 入力開始
      await user.type(input, 'テ');
      
      // タイマー表示確認
      expect(screen.getByText(/残り時間: 60秒/i)).toBeInTheDocument();
      
      // 30秒経過
      jest.advanceTimersByTime(30000);
      expect(screen.getByText(/残り時間: 30秒/i)).toBeInTheDocument();
      
      // 50秒経過（警告表示）
      jest.advanceTimersByTime(20000);
      expect(screen.getByText(/残り時間: 10秒/i)).toBeInTheDocument();
      expect(screen.getByText(/残り時間: 10秒/i)).toHaveClass('warning');
    });

    test('60秒経過で自動的にフォームを無効化', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} showTimer={true} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      
      // 入力開始
      await user.type(input, 'テストタスク');
      
      // 60秒経過
      jest.advanceTimersByTime(60000);
      
      // 入力フィールドが無効化される
      expect(input).toBeDisabled();
      expect(screen.getByText(/時間切れです/i)).toBeInTheDocument();
      
      // 送信ボタンも無効化
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      expect(submitButton).toBeDisabled();
    });

    test('送信完了でタイマーをリセット', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} showTimer={true} />);
      
      const input = screen.getByPlaceholderText(/タスク名/i);
      
      // タスク入力
      await user.type(input, 'クイックタスク');
      
      // 20秒経過
      jest.advanceTimersByTime(20000);
      expect(screen.getByText(/残り時間: 40秒/i)).toBeInTheDocument();
      
      // 送信
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      // タイマーがリセットされる
      expect(screen.queryByText(/残り時間:/i)).not.toBeInTheDocument();
      
      // フォームもリセット
      expect(input).toHaveValue('');
    });
  });

  describe('フォーム機能', () => {
    test('頻度選択が正しく動作する', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const frequencySelect = screen.getByLabelText(/頻度/i);
      
      await user.selectOptions(frequencySelect, 'weekly');
      
      expect(frequencySelect).toHaveValue('weekly');
    });

    test('リマインダー時間を設定できる', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const timeInput = screen.getByLabelText(/リマインダー時間/i);
      
      fireEvent.change(timeInput, { target: { value: '09:30' } });
      
      expect(timeInput).toHaveValue('09:30');
    });

    test('説明文を入力できる', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const descriptionInput = screen.getByPlaceholderText(/説明.*任意/i);
      const description = '毎朝のストレッチルーティン';
      
      await user.type(descriptionInput, description);
      
      expect(descriptionInput).toHaveValue(description);
    });

    test('すべてのフィールドを含めて送信される', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      // 各フィールドに入力
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      const descriptionInput = screen.getByPlaceholderText(/説明.*任意/i);
      const frequencySelect = screen.getByLabelText(/頻度/i);
      const timeInput = screen.getByLabelText(/リマインダー時間/i);
      
      await user.type(titleInput, '朝のヨガ');
      await user.type(descriptionInput, '15分間のヨガセッション');
      await user.selectOptions(frequencySelect, 'daily');
      fireEvent.change(timeInput, { target: { value: '06:00' } });
      
      // 送信
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: '朝のヨガ',
        description: '15分間のヨガセッション',
        frequency: 'daily',
        reminderTime: '06:00',
      });
    });

    test('キャンセルボタンでフォームをリセット', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      await user.type(titleInput, 'キャンセルされるタスク');
      
      const cancelButton = screen.getByRole('button', { name: /キャンセル/i });
      await user.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalled();
      expect(titleInput).toHaveValue('');
    });
  });

  describe('エラー処理', () => {
    test('送信エラー時にエラーメッセージを表示', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnSubmitWithError = jest.fn().mockRejectedValue(new Error('ネットワークエラー'));
      
      render(<TaskInput onSubmit={mockOnSubmitWithError} />);
      
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      await user.type(titleInput, 'エラーテスト');
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
      });
    });

    test('エラーメッセージは5秒後に自動的に消える', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnSubmitWithError = jest.fn().mockRejectedValue(new Error('一時的なエラー'));
      
      render(<TaskInput onSubmit={mockOnSubmitWithError} />);
      
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      await user.type(titleInput, 'エラーテスト');
      
      const submitButton = screen.getByRole('button', { name: /追加|保存/i });
      await user.click(submitButton);
      
      // エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
      });
      
      // 5秒経過
      jest.advanceTimersByTime(5000);
      
      await waitFor(() => {
        expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('アクセシビリティ', () => {
    test('Enterキーで送信できる', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      await user.type(titleInput, 'Enterキーテスト{Enter}');
      
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Enterキーテスト',
      }));
    });

    test('Escapeキーでキャンセルできる', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TaskInput onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const titleInput = screen.getByPlaceholderText(/タスク名/i);
      await user.type(titleInput, 'Escキーテスト');
      await user.keyboard('{Escape}');
      
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('適切なaria-labelが設定されている', () => {
      render(<TaskInput onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('form')).toHaveAccessibleName(/タスク追加フォーム/i);
      expect(screen.getByRole('textbox', { name: /タスク名/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /頻度/i })).toBeInTheDocument();
    });
  });
});