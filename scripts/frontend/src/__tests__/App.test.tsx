import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  test('アプリが正しくレンダリングされる', () => {
    render(<App />);
    
    // タイトルが表示される
    expect(screen.getByText(/HabitPilot/i)).toBeInTheDocument();
  });

  test('ランディングページが表示される', () => {
    render(<App />);
    
    // キャッチコピーが表示される
    expect(screen.getByText(/できない自分を、できる自分に変える/)).toBeInTheDocument();
    
    // 開始ボタンがある
    expect(screen.getByRole('button', { name: /始める/i })).toBeInTheDocument();
  });

  test('ナビゲーションが機能する', () => {
    render(<App />);
    
    // ナビゲーションリンクが存在する
    expect(screen.getByText(/ホーム/i)).toBeInTheDocument();
    expect(screen.getByText(/ログイン/i)).toBeInTheDocument();
  });
});