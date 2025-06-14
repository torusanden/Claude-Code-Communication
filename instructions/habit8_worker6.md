# 🚀 HabitPilot（habit8）プロジェクト - 技術基盤 担当指示書

## 👤 あなたの役割：habit8_worker6
- チーム全体がスムーズに開発できるように、**React Native (Expo) 環境の初期セットアップと開発基盤の整備**を担当してください。

---

## ✅ 主なタスク

1. **プロジェクト初期化**
   - `expo init` を使って TypeScript ベースのテンプレートからスタート
   - プロジェクト名は `habitpilot` または `habit8` を想定

2. **ディレクトリ構成の整備**
   - `/screens`, `/components`, `/contexts`, `/utils`, `/assets`, `/models` などをあらかじめ作成
   - `README.md` にディレクトリ構成と役割を記載

3. **開発ルールの整備**
   - ESLint / Prettier の導入と設定
   - VSCode拡張機能用 `.vscode/settings.json` の推奨設定ファイルも用意

4. **初期ライブラリ導入**
   - 例（必要に応じて）：
     - `@react-navigation/native`, `react-native-async-storage/async-storage`
     - `dayjs`, `react-native-svg`, `expo-notifications` など
   - `package.json` への依存追加、バージョン管理

5. **README.md の作成**
   - 以下を記載：
     - セットアップ手順（`npm install`, `npx expo start`）
     - 使用技術一覧
     - フォルダ構成と運用ルール
     - コーディング規約の簡易ガイド

---

## 📁 成果物（例）

```
habitpilot/
├── app.json
├── package.json
├── README.md
├── .eslintrc.js
├── .prettierrc
├── .vscode/
│   └── settings.json
├── screens/
├── components/
├── contexts/
├── utils/
├── models/
├── assets/
```

---

## 🛠 使用技術

- Expo（React Native）＋ TypeScript
- ESLint（lint整備）、Prettier（コード整形）
- VSCode 設定ファイル（任意で補助）

---

## 🎯 成功基準

- チーム全員がすぐに開発を始められる状態を作ること
- コードフォーマットとプロジェクト構成が明確で迷いがないこと
- ドキュメントがあり、新規メンバーでも1時間以内に環境構築が完了できる
