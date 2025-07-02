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
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "注文内容が不正です" });
  }
  try {
    // 1回の注文でOrderを1件作成し、OrderItemを複数作成
    const order = await prisma.order.create({
      data: {
        memberid,
        orderdate: new Date(),
        creditcardid: "dummy", // 本番ではカード情報を別管理
        items: {
          create: items.map((item: any) => ({
            productid: item.id,
            quantity: item.quantity,
            price: item.price,
            point: 0, // ポイント未対応
          })),
        },
      },
    });
    return res.status(200).json({ ok: true, orderId: order.id });
  } catch (e) {
    console.error("注文登録エラー:", e);
    return res
      .status(500)
      .json({
        error: "注文登録に失敗しました",
        details: e instanceof Error ? e.message : String(e),
      });
  }
}
