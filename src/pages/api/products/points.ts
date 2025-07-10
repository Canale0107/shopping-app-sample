import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "不正なリクエストです" });
  }
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, point: true },
  });
  const result: { [id: string]: number } = {};
  products.forEach((p) => {
    result[p.id] = p.point;
  });
  return res.status(200).json(result);
}
