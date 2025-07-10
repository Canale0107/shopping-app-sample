import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "未認証です" });
    }
    const member = await prisma.member.findUnique({
      where: { memberid: session.user.email },
      select: { memberid: true, membername: true, memberpoint: true },
    });
    if (!member) return res.status(404).json({ error: "会員が見つかりません" });
    return res.status(200).json(member);
  }
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "未認証です" });
  }
  const { name, address, phone, password } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }
  const data: any = {
    membername: name,
    address,
    phone,
  };
  if (password) {
    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "パスワードは6文字以上で入力してください" });
    }
    data.password = await bcrypt.hash(password, 10);
  }
  await prisma.member.update({
    where: { memberid: session.user.email },
    data,
  });
  return res.status(200).json({ message: "更新完了" });
}
