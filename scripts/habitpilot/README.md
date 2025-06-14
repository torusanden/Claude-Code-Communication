# HabitPilot

**できない自分を、できる自分に変える** - 習慣化支援アプリケーション

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/your-username/habitpilot.git
cd habitpilot

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:3000 で起動します

## ✨ 主要機能

1. **ワンタップ習慣記録** - 1分以内で習慣を記録できるシンプルなUI
2. **自己肯定感スコア** - 習慣達成度から自動計算される成長指標
3. **週次レビュー** - 1週間の振り返りと改善ポイントの可視化

## 🚀 デプロイ方法

### Vercel（フロントエンド）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel

# 環境変数を設定
# REACT_APP_API_URL=https://your-api.railway.app
```

### Railway（バックエンド）

1. [Railway](https://railway.app/)にサインイン
2. "New Project" → "Deploy from GitHub repo"を選択
3. 環境変数を設定:
   - `DATABASE_URL`: PostgreSQL接続文字列
   - `JWT_SECRET`: ランダムな秘密鍵
   - `NODE_ENV`: production

## 📦 技術スタック

- **フロントエンド**: React, TypeScript, Tailwind CSS
- **バックエンド**: Node.js, Express, PostgreSQL
- **認証**: JWT
- **ホスティング**: Vercel + Railway

## 🛠️ 開発

```bash
# テストを実行
npm test

# ビルド
npm run build

# リント
npm run lint
```

---

Made with ❤️ by HabitPilot Team