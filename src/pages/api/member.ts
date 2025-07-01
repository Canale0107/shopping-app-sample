import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getSession({ req });
  if (!session?.user?.email) {
    return res.status(401).json({ error: "未認証です" });
  }
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }
  await prisma.member.update({
    where: { memberid: session.user.email },
    data: {
      membername: name,
      address,
      phone,
    },
  });
  return res.status(200).json({ message: "更新完了" });
}
