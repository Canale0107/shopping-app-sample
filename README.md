# ショッピングサイト サンプル（Next.js + Prisma + PostgreSQL）

## 概要

このプロジェクトは、Next.js（TypeScript）・Prisma・PostgreSQL・NextAuth.js を使ったモダンなショッピングサイトのサンプルです。

- 商品検索・カテゴリ絞り込み
- 会員登録・ログイン/ログアウト
- 会員情報照会（注文履歴・ポイント表示）
- 注文履歴の表形式表示
- Docker Compose による DB・アプリの一括起動

---

## セットアップ手順

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
4. ダミーデータ投入
   ```sh
   npx ts-node prisma/seed.ts
   ```
5. 開発サーバー起動
   ```sh
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

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
2. ブラウザが自動で開き、Member テーブル（会員情報）が一覧で確認できます。
