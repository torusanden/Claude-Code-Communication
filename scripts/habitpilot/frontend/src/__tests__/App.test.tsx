import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import * as api from '../api/client';

// APIモック
jest.mock('../api/client');
const mockedApi = api as jest.Mocked<typeof api>;

// テスト用のラッパーコンポーネント
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: AllTheProviders });
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('初回アクセス時にランディングページが表示される', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByText(/できない自分を、できる自分に変える/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /始める/i })).toBeInTheDocument();
  });

  test('ログイン後にダッシュボードが表示される', async () => {
    // ログイン状態をモック
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([
      {
        id: '1',
        title: '朝のストレッチ',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText(/ダッシュボード/i)).toBeInTheDocument();
      expect(screen.getByText(/朝のストレッチ/i)).toBeInTheDocument();
    });
  });

  test('新しい習慣を追加できる', async () => {
    const user = userEvent.setup();
    
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([]);
    mockedApi.createTask.mockResolvedValue({
      id: '2',
      title: '読書30分',
      completed: false,
      createdAt: new Date().toISOString(),
    });

    renderWithProviders(<App />);

    // 新規作成ボタンをクリック
    const addButton = await screen.findByRole('button', { name: /新しい習慣/i });
    await user.click(addButton);

    // フォームに入力
    const input = screen.getByPlaceholderText(/習慣の名前/i);
    await user.type(input, '読書30分');

    // 保存ボタンをクリック
    const saveButton = screen.getByRole('button', { name: /保存/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedApi.createTask).toHaveBeenCalledWith({
        title: '読書30分',
      });
      expect(screen.getByText('読書30分')).toBeInTheDocument();
    });
  });

  test('習慣を完了済みにできる', async () => {
    const user = userEvent.setup();
    
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([
      {
        id: '1',
        title: '瞑想',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    mockedApi.updateTask.mockResolvedValue({
      id: '1',
      title: '瞑想',
      completed: true,
      createdAt: new Date().toISOString(),
    });

    renderWithProviders(<App />);

    // チェックボックスをクリック
    const checkbox = await screen.findByRole('checkbox', { name: /瞑想/i });
    await user.click(checkbox);

    await waitFor(() => {
      expect(mockedApi.updateTask).toHaveBeenCalledWith('1', {
        completed: true,
      });
      expect(checkbox).toBeChecked();
    });
  });

  test('エラー時にエラーメッセージが表示される', async () => {
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockRejectedValue(new Error('認証エラー'));

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });
  });

  test('ログアウトできる', async () => {
    const user = userEvent.setup();
    
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([]);

    renderWithProviders(<App />);

    // ログアウトボタンをクリック
    const logoutButton = await screen.findByRole('button', { name: /ログアウト/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(screen.getByText(/できない自分を、できる自分に変える/i)).toBeInTheDocument();
    });
  });

  test('通知権限をリクエストできる', async () => {
    const user = userEvent.setup();
    const mockRequestPermission = jest.fn().mockResolvedValue('granted');
    
    // Notification APIをモック
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'default',
        requestPermission: mockRequestPermission,
      },
      writable: true,
    });

    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([]);

    renderWithProviders(<App />);

    // 通知設定ボタンをクリック
    const notificationButton = await screen.findByRole('button', { name: /通知設定/i });
    await user.click(notificationButton);

    // 許可ボタンをクリック
    const allowButton = screen.getByRole('button', { name: /通知を許可/i });
    await user.click(allowButton);

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
    });
  });

  test('週次レビューが表示される', async () => {
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getWeeklyReview.mockResolvedValue({
      weekStartDate: '2024-01-01',
      weekEndDate: '2024-01-07',
      completionRate: 75,
      totalTasks: 28,
      completedTasks: 21,
      insights: [
        '朝の習慣の達成率が高いです',
        '週末の達成率が低下しています',
      ],
    });

    renderWithProviders(<App />);

    // レビュータブをクリック
    const reviewTab = await screen.findByRole('tab', { name: /週次レビュー/i });
    fireEvent.click(reviewTab);

    await waitFor(() => {
      expect(screen.getByText(/75%/)).toBeInTheDocument();
      expect(screen.getByText(/朝の習慣の達成率が高いです/i)).toBeInTheDocument();
    });
  });

  test('習慣の検索ができる', async () => {
    const user = userEvent.setup();
    
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([
      {
        id: '1',
        title: '朝のランニング',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: '夜の読書',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('朝のランニング')).toBeInTheDocument();
      expect(screen.getByText('夜の読書')).toBeInTheDocument();
    });

    // 検索ボックスに入力
    const searchBox = screen.getByPlaceholderText(/習慣を検索/i);
    await user.type(searchBox, '朝');

    await waitFor(() => {
      expect(screen.getByText('朝のランニング')).toBeInTheDocument();
      expect(screen.queryByText('夜の読書')).not.toBeInTheDocument();
    });
  });

  test('習慣の削除ができる', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn().mockReturnValue(true);
    
    localStorage.setItem('auth_token', 'test_token');
    mockedApi.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });

    mockedApi.getTasks.mockResolvedValue([
      {
        id: '1',
        title: '削除予定の習慣',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    mockedApi.deleteTask.mockResolvedValue(undefined);

    renderWithProviders(<App />);

    // 削除ボタンをクリック
    const deleteButton = await screen.findByRole('button', { name: /削除/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('この習慣を削除しますか？');
      expect(mockedApi.deleteTask).toHaveBeenCalledWith('1');
      expect(screen.queryByText('削除予定の習慣')).not.toBeInTheDocument();
    });
  });
});