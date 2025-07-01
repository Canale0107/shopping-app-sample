import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useState } from "react";

export default function Profile({ member, orders }: any) {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member.membername);
  const [address, setAddress] = useState(member.address);
  const [phone, setPhone] = useState(member.phone);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  if (status === "loading") return null;
  if (!session) return null;
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");
    if (password && password.length < 6) {
      setSaveError("パスワードは6文字以上で入力してください");
      return;
    }
    if (password && password !== passwordConfirm) {
      setSaveError("パスワードが一致しません");
      return;
    }
    const res = await fetch("/api/member", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, phone, password }),
    });
    if (res.ok) {
      setSaveSuccess("会員情報を更新しました");
      setEditing(false);
      setPassword("");
      setPasswordConfirm("");
    } else {
      const data = await res.json();
      setSaveError(data.error || "更新に失敗しました");
    }
  };
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>会員情報</h1>
      {editing ? (
        <form onSubmit={handleSave} style={{ marginBottom: 24 }}>
          <div>
            <label>名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>住所</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label>電話番号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label>新しいパスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label>パスワード（確認）</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {saveError && <p style={{ color: "red" }}>{saveError}</p>}
          {saveSuccess && <p style={{ color: "green" }}>{saveSuccess}</p>}
          <button type="submit">保存</button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            style={{ marginLeft: 12 }}
          >
            キャンセル
          </button>
        </form>
      ) : (
        <>
          <ul>
            <li>
              <strong>現在のポイント:</strong> {member.memberpoint}
            </li>
            <li>
              <strong>会員ID:</strong> {member.memberid}
            </li>
            <li>
              <strong>名前:</strong> {name}
            </li>
            <li>
              <strong>住所:</strong> {address}
            </li>
            <li>
              <strong>電話番号:</strong> {phone}
            </li>
          </ul>
          <button onClick={() => setEditing(true)} style={{ marginBottom: 24 }}>
            編集
          </button>
        </>
      )}
      <h2>注文履歴</h2>
      <table
        border="1"
        cellPadding={8}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>日付</th>
            <th>商品ID</th>
            <th>商品名</th>
            <th>価格</th>
            <th>お買い上げ数量</th>
            <th>金額</th>
            <th>ポイント</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7}>注文履歴はありません</td>
            </tr>
          ) : (
            orders.map((order: any) => (
              <tr key={order.orderid}>
                <td>{order.orderdate.slice(0, 10)}</td>
                <td>{order.productid}</td>
                <td>{order.product.name}</td>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
                <td>{order.price * order.quantity}</td>
                <td>{order.point * order.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const member = await prisma.member.findUnique({
    where: { memberid: session.user.email },
    select: {
      memberid: true,
      membername: true,
      address: true,
      phone: true,
      memberpoint: true,
    },
  });
  const orders = await prisma.order.findMany({
    where: { memberid: session.user.email },
    include: { product: { select: { name: true } } },
    orderBy: { orderdate: "desc" },
  });
  const ordersSerialized = orders.map((order) => ({
    ...order,
    orderdate: order.orderdate.toISOString(),
  }));
  return { props: { member, orders: ordersSerialized } };
};
