import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "ログインが必要です" });
  }
  const memberid = session.user.email;
  const { items, usePoint } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "注文内容が不正です" });
  }
  try {
    // 商品情報を取得
    const productIds = items.map((item: any) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    // 商品ごとのポイントを計算
    let totalPoint = 0;
    let totalPrice = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.id);
      const point = product ? product.point : 0;
      totalPoint += point * item.quantity;
      totalPrice += item.price * item.quantity;
      return {
        productid: item.id,
        quantity: item.quantity,
        price: item.price,
        point,
      };
    });
    // 会員情報取得
    const member = await prisma.member.findUnique({ where: { memberid } });
    if (!member) return res.status(400).json({ error: "会員が見つかりません" });
    // 利用ポイントのバリデーション
    const usePointInt = Math.max(0, parseInt(usePoint, 10) || 0);
    if (usePointInt > member.memberpoint) {
      return res
        .status(400)
        .json({ error: "利用ポイントが保有ポイントを超えています" });
    }
    if (usePointInt > totalPrice) {
      return res
        .status(400)
        .json({ error: "利用ポイントが合計金額を超えています" });
    }
    // 割引後の金額
    const finalPrice = totalPrice - usePointInt;
    // 1回の注文でOrderを1件作成し、OrderItemを複数作成
    const order = await prisma.order.create({
      data: {
        memberid,
        orderdate: new Date(),
        creditcardid: "dummy", // 本番ではカード情報を別管理
        items: {
          create: orderItems,
        },
      },
    });
    // 会員ポイント加算・減算
    await prisma.member.update({
      where: { memberid },
      data: {
        memberpoint: { increment: totalPoint - usePointInt },
      },
    });
    return res.status(200).json({ ok: true, orderId: order.id });
  } catch (e) {
    console.error("注文登録エラー:", e);
    return res.status(500).json({
      error: "注文登録に失敗しました",
      details: e instanceof Error ? e.message : String(e),
    });
  }
}
