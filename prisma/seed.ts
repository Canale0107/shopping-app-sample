import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ダミー商品
  const product = await prisma.product.upsert({
    where: { id: "product-1" },
    update: {},
    create: {
      id: "product-1",
      name: "サンプル商品",
      price: 1000,
      category: {
        connectOrCreate: {
          where: { id: "cat-1" },
          create: { id: "cat-1", name: "サンプルカテゴリ" },
        },
      },
    },
  });

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
  await prisma.order.create({
    data: {
      memberid: member.memberid,
      orderdate: new Date(),
      creditcardid: "4111111111111111",
      productid: product.id,
      quantity: 2,
      price: 1000,
      point: 10,
    },
  });

  console.log("ダミー会員・商品・注文を作成しました");
}

main().finally(() => prisma.$disconnect());
