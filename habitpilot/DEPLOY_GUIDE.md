# 🚀 HabitPilot デプロイガイド

このガイドでは、HabitPilotをVercelにデプロイする手順を説明します。

## 📋 前提条件
- Node.js 18以上がインストールされていること
- Vercelアカウントを持っていること（無料で作成可能）

## 🔧 ビルド確認
すでにビルドは完了しています。`frontend/dist/`フォルダに以下のファイルが生成されています：
- index.html (0.48KB)
- assets/index-*.css (0.33KB)
- assets/index-*.js (452.83KB)

## 📦 Vercelへのデプロイ手順

### 方法1: Vercel CLI を使用（推奨）

1. **Vercel CLIをインストール**
```bash
npm i -g vercel
```

2. **プロジェクトディレクトリに移動**
```bash
cd habitpilot/frontend
```

3. **Vercelにログイン**
```bash
vercel login
```

4. **デプロイ実行**
```bash
vercel --prod
```

初回は以下の質問に答えてください：
- Set up and deploy: `Y`
- Which scope: あなたのアカウントを選択
- Link to existing project: `N`
- Project name: `habitpilot`（または任意の名前）
- Directory: `./` （そのままEnter）
- Build Command: `npm run build`（自動検出される）
- Output Directory: `dist`（自動検出される）

### 方法2: Vercel Webサイトから

1. [vercel.com](https://vercel.com)にログイン
2. 「New Project」をクリック
3. 「Upload」タブを選択
4. `frontend/dist`フォルダをドラッグ&ドロップ
5. プロジェクト名を入力して「Deploy」

### 方法3: GitHubと連携

1. このプロジェクトをGitHubにプッシュ
2. Vercelで「Import Git Repository」を選択
3. リポジトリを選択
4. 以下の設定を行う：
   - Root Directory: `habitpilot/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

## ✅ デプロイ後の確認

デプロイが完了すると、以下のようなURLが発行されます：
- `https://habitpilot.vercel.app`
- `https://habitpilot-xxxxx.vercel.app`

ブラウザでアクセスして動作を確認してください。

## 🔍 トラブルシューティング

### ビルドエラーが発生する場合
```bash
cd habitpilot/frontend
npm install
npm run build
```

### 404エラーが表示される場合
`vercel.json`の設定を確認してください。

## 🎉 完了！

これでHabitPilotが世界中からアクセス可能になりました。
「できない自分を、できる自分に変える」旅が始まります！