import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password, name, address, phone } = req.body;
  if (!email || !password || !name || !address || !phone) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }
  const existing = await prisma.member.findUnique({
    where: { memberid: email },
  });
  if (existing) {
    return res
      .status(409)
      .json({ error: "このメールアドレスは既に登録されています" });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.member.create({
    data: {
      memberid: email,
      password: hashed,
      membername: name,
      address,
      phone,
      gender: "未設定",
      memberpoint: 0,
    },
  });
  return res.status(201).json({ message: "登録完了" });
}
