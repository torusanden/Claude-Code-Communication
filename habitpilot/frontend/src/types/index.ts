// 型定義ファイル - 将来の拡張に備えて
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  // 将来追加予定
  // category?: string;
  // frequency?: 'daily' | 'weekly' | 'custom';
  // targetTime?: string;
  // streak?: number;
  // createdAt?: Date;
  // updatedAt?: Date;
}

export interface User {
  // 将来の認証機能用
  id?: string;
  email?: string;
  name?: string;
}

export interface Score {
  value: number;
  date: Date;
  // 将来追加予定
  // breakdown?: {
  //   completionRate: number;
  //   streakBonus: number;
  //   consistencyBonus: number;
  // };
}