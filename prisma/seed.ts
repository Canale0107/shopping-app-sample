import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// カテゴリ名マッピング
const CATEGORY_MAP: Record<string, string> = {
  tshirt: "Tシャツ",
  trouser: "ズボン",
  pullover: "プルオーバー",
  dress: "ドレス",
  coat: "コート",
  sandal: "サンダル",
  shirt: "シャツ",
  sneaker: "スニーカー",
  bag: "バッグ",
  ankleboot: "アンクルブーツ",
};

// カテゴリごとの現実的な価格候補リスト
const CATEGORY_PRICE_CANDIDATES: Record<string, number[]> = {
  tshirt: [980, 1280, 1480, 1980, 2480, 2980, 3480],
  trouser: [1980, 2480, 2980, 3980, 4980, 5980],
  pullover: [1980, 2480, 2980, 3980, 4980],
  dress: [2980, 3980, 4980, 6980, 9800, 12800],
  coat: [4980, 6980, 9800, 12800, 15800, 19800],
  sandal: [980, 1480, 1980, 2480, 2980, 3980],
  shirt: [1280, 1480, 1980, 2480, 2980, 3980, 4980],
  sneaker: [2980, 3980, 4980, 6980, 9800, 12800, 14800],
  bag: [1980, 2980, 3980, 4980, 6980, 9800, 12800, 19800],
  ankleboot: [3980, 4980, 6980, 9800, 12800, 15800, 17800],
};

async function main() {
  // ESM形式で__dirnameの代わり
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // 商品画像ディレクトリ
  const imagesDir = path.join(__dirname, "../public/images/products");
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".png"));

  // カテゴリごとにIDを割り当て
  const categoryIds: Record<string, string> = {};
  for (const key of Object.keys(CATEGORY_MAP)) {
    const id = `cat-${key}`;
    await prisma.category.upsert({
      where: { id },
      update: {},
      create: { id, name: CATEGORY_MAP[key] },
    });
    categoryIds[key] = id;
  }

  // 商品を全削除してから投入（再現性のため）
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // 画像ファイルごとに商品を作成
  for (const file of files) {
    // 例: tshirt_01.png
    const [key, num] = file.replace(".png", "").split("_");
    const categoryId = categoryIds[key];
    const name = `${CATEGORY_MAP[key]} ${parseInt(num, 10)}`;
    // 商品ごとに異なるポイント設定（例: 50〜200pt）
    const point = 50 + ((parseInt(num, 10) * 10) % 151); // 50, 60, ... 200, 50, ...
    // カテゴリごとの価格候補からランダムに選択
    const candidates = CATEGORY_PRICE_CANDIDATES[key] || [
      1980, 2980, 3980, 4980,
    ];
    const price =
      candidates[
        (parseInt(num, 10) + Math.floor(Math.random() * candidates.length)) %
          candidates.length
      ];
    await prisma.product.create({
      data: {
        name,
        price,
        point,
        imageUrl: `/images/products/${file}`,
        categoryId,
      },
    });
  }

  // ダミー会員
  const hashed = await bcrypt.hash("password123", 10);
  const member = await prisma.member.upsert({
    where: { memberid: "test@example.com" },
    update: {},
    create: {
      memberid: "test@example.com",
      password: hashed,
      membername: "テスト太郎",
      gender: "男性",
      address: "東京都千代田区1-1-1",
      phone: "090-1234-5678",
      memberpoint: 100,
    },
  });

  // ダミー注文
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.create({
      data: {
        memberid: member.memberid,
        orderdate: new Date(),
        creditcardid: "4111111111111111",
        items: {
          create: [
            {
              productid: firstProduct.id,
              quantity: 2,
              price: firstProduct.price,
              point: firstProduct.point,
            },
          ],
        },
      },
    });
  }

  console.log("画像と一致した商品データ・ダミー会員・注文を作成しました");
}

main().finally(() => prisma.$disconnect());
