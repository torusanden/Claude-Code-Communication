# 🔧 HabitPilot（habit8）プロジェクト - バックエンド / API 担当指示書

## 🧑‍💻 あなたの役割：habit8_worker3
- バックエンド全般（Express サーバー、REST API、認証処理）を構築し、フロントと連携できる API を提供してください。

---

## 📋 主なタスク

1. **Node.js + Express による REST API 実装**
   - GET / POST / PUT / DELETE のルーティングを実装
   - エンドポイント例: `/api/tasks`, `/api/auth/login`, `/api/auth/register`

2. **認証機能の実装**
   - ユーザー登録・ログインの API を構築
   - JWT によるトークン認証
   - bcrypt によるパスワードハッシュ化

3. **タスクデータの CRUD 処理**
   - タスク追加・更新・削除・取得が行えるエンドポイント
   - 各ユーザーに紐づくタスクだけが扱えるように制限

4. **mockDB または簡易DBの利用**
   - SQLite / JSON Server / ローカル PostgreSQL を選択可能

---

## 📁 成果物ディレクトリ構成

```
server/
├── routes/
│   ├── tasks.js         # タスク関連 API
│   └── auth.js          # 認証関連 API
├── middleware/
│   └── authMiddleware.js  # JWT 検証処理など
├── controllers/
│   └── taskController.js  # 各 API のビジネスロジック
├── models/
│   └── User.js / Task.js  # DB モデル定義（任意）
├── db/
│   └── sqlite.db         # SQLite データベース（または PostgreSQL）
└── app.js               # メインエントリーポイント
```

---

## 🛠 使用技術スタック

- **Node.js**
- **Express**
- **JWT / bcrypt**
- **SQLite** または **PostgreSQL**
- 任意で **Prisma** や **Sequelize** の使用も可

---

## ✅ 補足ポイント

- JWTトークンはヘッダーで送受信（`Authorization: Bearer <token>`）
- 認証が必要なルートにはミドルウェアで保護を追加
- 非同期処理（async/await）と try/catch で安定性を確保

---

## 🎯 最終目標

- モバイルアプリから利用可能な API を提供
- ローカルでも動作確認ができるエミュレート環境を整備
- 認証付きタスク管理が最低限機能する状態に到達
