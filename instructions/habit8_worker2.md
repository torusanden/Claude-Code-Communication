# 🧠 HabitPilot（habit8）プロジェクト - データ管理 担当指示書

## 👤 あなたの役割：habit8_worker2
アプリの「状態」と「データ構造」を支えるコアを設計・実装してください。  
タスク・習慣などの情報を安定して保持・更新・取得する仕組みを構築します。

---

## 📋 主なタスク

1. **データ構造設計（Type定義）**
   - タスク、習慣、スコア、振り返りデータなど
   - 型安全な `models/` 内 TypeScript ファイルとして定義

2. **状態管理（ステート管理）**
   - Context API または Redux Toolkit を導入
   - Provider設計・useContext or useSelector による取得

3. **ローカルストレージ対応**
   - AsyncStorage を用いた保存・読み込みロジック作成
   - 起動時の初期読み込み、書き込み更新関数の抽象化

---

## 🗂 成果物構成

| ファイル/フォルダ                 | 内容                                               |
|-----------------------------------|----------------------------------------------------|
| `contexts/`                       | グローバルステート管理（Context or Redux）         |
| `models/TaskModel.ts` 等          | 各種エンティティの型定義                          |
| `utils/storage.ts`                | AsyncStorage による保存・取得ロジック              |

---

## 🧰 使用技術・前提環境

- TypeScript（型定義必須）
- React Context API または Redux Toolkit
- `@react-native-async-storage/async-storage`

---

## 🔑 実装ポイント

- 状態は**スケーラブルに管理可能な構造**を意識すること
- 型安全（TypeScript）を徹底して、他メンバーが安心して使える基盤を作る
- 非同期アクセスには `useEffect + async/await` を活用しつつ、抽象化関数で統一

---

## ✅ 補足ヒント

- ストレージ層と状態層を分離することで再利用性・テスト性が向上します
- 初期データ投入や reset 機能も忘れずに設計しておくと便利です

---
