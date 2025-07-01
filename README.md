# ショッピングサイト サンプル（Next.js + Prisma + PostgreSQL）

## 前提条件

- Docker & Docker Compose
- git

## セットアップ手順（初回）

1. リポジトリをクローン

   ```sh
   git clone <このリポジトリのURL>
   cd shopping
   ```

2. `.env`ファイルの作成

   - `.envsample` をコピーして `.env` を作成し、必要に応じて編集してください。

   ```sh
   cp .envsample .env
   ```

   - `DATABASE_URL`：PostgreSQL の接続情報を自分の環境に合わせて設定
   - `NEXTAUTH_SECRET`：本番運用時は `openssl rand -base64 32` などで生成した 32 文字以上のランダムな値を推奨

3. Docker Compose で起動

   ```sh
   docker compose up -d
   ```

   - このコマンドで PostgreSQL と Next.js アプリケーションが同時に起動します
   - 初回起動時は自動でマイグレーションとシードデータの投入が実行されます

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

> **注意**: このプロジェクトは Docker Compose での運用を前提としています。
>
> - Prisma Client の生成は Docker ビルド時に自動で実行されます
> - データベースのマイグレーションとシード投入も初回起動時に自動実行されます
> - アプリケーションは `npm run dev` で起動し、ホットリロードに対応しています

---

## 概要

このプロジェクトは、Next.js（TypeScript）・Prisma・PostgreSQL・NextAuth.js を使ったモダンなショッピングサイトのサンプルです。

- 商品検索・カテゴリ絞り込み
- 会員登録・ログイン/ログアウト
- 会員情報照会（注文履歴・ポイント表示）
- 注文履歴の表形式表示
- Docker Compose による DB・アプリの一括起動

---

## 初期データの自動化

このリポジトリでは、`public/images/products/` 配下の画像と DB の商品データが必ず一致するようになっています。

### データの再投入が必要な場合

Docker 環境でデータを再投入したい場合は、以下のコマンドを実行してください：

```sh
# コンテナ内でマイグレーションとシードを実行
docker compose exec app npx prisma migrate reset --force
docker compose exec app npx ts-node prisma/seed.ts
```

---

## ダミーユーザー情報

- 会員 ID: `test@example.com`
- パスワード: `password123`

---

## 主な機能

- トップ画面：商品一覧＋カテゴリ検索
- ログイン/ログアウト（ヘッダーから）
- 会員情報照会（ポイント・注文履歴・会員情報）
- 注文履歴：日付、商品 ID、商品名、価格、数量、金額、ポイントを表形式で表示

---

## 技術スタック

- Next.js (TypeScript)
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Docker Compose

---

## 開発 Tips

- Prisma Studio で DB を GUI 管理：
  ```sh
  docker compose exec app npx prisma studio
  ```
- スキーマ変更時：
  ```sh
  docker compose exec app npx prisma migrate dev --name <migration名>
  docker compose exec app npx prisma generate
  ```
- ダミーデータ再投入：
  ```sh
  docker compose exec app npx ts-node prisma/seed.ts
  ```

---

## 登録ユーザーの確認

登録されている会員（ユーザー）情報を確認したい場合は、Prisma Studio を利用するのが便利です。

1. プロジェクトルートで以下のコマンドを実行してください。
   ```sh
   docker compose exec app npx prisma studio
   ```
