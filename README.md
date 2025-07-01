# ショッピングサイト サンプル（Next.js + Prisma + PostgreSQL）

## 前提条件

- Node.js v18 以上
- npm v9 以上
- Docker & Docker Compose（PostgreSQL をローカルで用意する場合は不要）
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

3. Docker Compose で DB を起動（必要な場合のみ）

   ```sh
   docker compose up -d
   ```

   - すでに PostgreSQL がローカルで起動している場合は不要です。
   - 初回セットアップや DB を Docker で管理する場合は必ずこのコマンドを実行してください。

4. 依存パッケージのインストール
   ```sh
   npm install
   ```
5. Prisma Client の生成
   ```sh
   npx prisma generate
   ```
6. DB マイグレーション＆リセット（開発用）
   ```sh
   npx prisma migrate reset --force
   ```
7. 商品画像と DB を一致させるシード投入
   ```sh
   npx ts-node prisma/seed.ts
   ```
8. 開発サーバー起動
   ```sh
   npm run dev
   ```
9. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

> `npx ts-node prisma/seed.ts` を実行することで、`public/images/products/` 配下の全画像に対応した商品データが DB に投入されます。

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

### 初期データの再現手順

1. 依存パッケージのインストール
   ```sh
   npm install
   ```
2. Prisma Client の生成
   ```sh
   npx prisma generate
   ```
3. DB マイグレーション＆リセット（開発用）
   ```sh
   npx prisma migrate reset --force
   ```
4. 商品画像と DB を一致させるシード投入
   ```sh
   npx ts-node prisma/seed.ts
   ```
5. 開発サーバー起動
   ```sh
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

> `npx ts-node prisma/seed.ts` を実行することで、`public/images/products/` 配下の全画像に対応した商品データが DB に投入されます。

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
  npx prisma studio
  ```
- スキーマ変更時：
  ```sh
  npx prisma migrate dev --name <migration名>
  npx prisma generate
  ```
- ダミーデータ再投入：
  ```sh
  npx ts-node prisma/seed.ts
  ```

---

## 登録ユーザーの確認

登録されている会員（ユーザー）情報を確認したい場合は、Prisma Studio を利用するのが便利です。

1. プロジェクトルートで以下のコマンドを実行してください。
   ```sh
   npx prisma studio
   ```
