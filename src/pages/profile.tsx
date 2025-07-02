import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Modal } from "../components/Modal";

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
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    <div className="main-area">
      <div style={{ maxWidth: 800, margin: "2rem auto" }}>
        <h1 className="mb-24">会員情報</h1>
        <div className="card">
          {editing ? (
            <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
              <div className="mb-16">
                <label className="label">名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-16">
                <label className="label">住所</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-16">
                <label className="label">電話番号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-16">
                <label className="label">新しいパスワード（6文字以上）</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-16">
                <label className="label">パスワード（確認）</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {saveError && <p className="text-error mb-16">{saveError}</p>}
              {saveSuccess && (
                <p className="text-success mb-16">{saveSuccess}</p>
              )}
              <div style={{ display: "flex", gap: 16 }}>
                <button type="submit" className="profile-edit-btn">
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{ background: "#eee", color: "#222" }}
                  className="profile-edit-btn"
                >
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
              <div style={{ minWidth: 260, flex: 1 }}>
                <div className="mb-16">
                  <span className="label">現在のポイント</span>
                  <div className="profile-point">{member.memberpoint} pt</div>
                </div>
                <div className="mb-16">
                  <span className="label">会員ID</span>
                  <div className="profile-value">{member.memberid}</div>
                </div>
                <div className="mb-16">
                  <span className="label">名前</span>
                  <div className="profile-value">{name}</div>
                </div>
                <div className="mb-16">
                  <span className="label">住所</span>
                  <div className="profile-value">{address}</div>
                </div>
                <div className="mb-16">
                  <span className="label">電話番号</span>
                  <div className="profile-value">{phone}</div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="profile-edit-btn"
                >
                  編集
                </button>
              </div>
            </div>
          )}
        </div>
        <h2 className="mb-16">注文履歴</h2>
        <div className="card" style={{ padding: 0 }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th></th>
                <th>日付</th>
                <th>商品数</th>
                <th>合計金額</th>
                <th>合計ポイント</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", color: "#888" }}
                  >
                    注文履歴はありません
                  </td>
                </tr>
              ) : (
                orders.map((order: any, idx: number) => {
                  const total = order.products.reduce(
                    (sum: number, p: any) => sum + p.price * p.quantity,
                    0
                  );
                  const totalPoint = order.products.reduce(
                    (sum: number, p: any) => sum + p.point * p.quantity,
                    0
                  );
                  const totalQty = order.products.reduce(
                    (sum: number, p: any) => sum + p.quantity,
                    0
                  );
                  const isOpen = openIndex === idx;
                  return (
                    <>
                      <tr
                        key={order.orderid + idx}
                        style={{
                          cursor: "pointer",
                          background: isOpen ? "#f7faff" : undefined,
                        }}
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                      >
                        <td style={{ width: 32, textAlign: "center" }}>
                          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                        </td>
                        <td>{order.orderdate.slice(0, 10)}</td>
                        <td>{totalQty} 個</td>
                        <td>{total} 円</td>
                        <td>{totalPoint} pt</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={5} style={{ background: "#f7faff" }}>
                            <table style={{ width: "100%", margin: "8px 0" }}>
                              <thead>
                                <tr>
                                  <th>画像</th>
                                  <th>商品名</th>
                                  <th>価格</th>
                                  <th>数量</th>
                                  <th>小計</th>
                                  <th>ポイント</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((p: any, i: number) => (
                                  <tr key={i}>
                                    <td>
                                      {p.imageUrl && (
                                        <img
                                          src={p.imageUrl}
                                          alt={p.name}
                                          style={{
                                            width: 48,
                                            height: 48,
                                            objectFit: "contain",
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td>{p.name}</td>
                                    <td>{p.price} 円</td>
                                    <td>{p.quantity} 個</td>
                                    <td>{p.price * p.quantity} 円</td>
                                    <td>{p.point * p.quantity} pt</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
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
  const ordersRaw = await prisma.order.findMany({
    where: { memberid: session.user.email },
    include: { product: { select: { name: true, imageUrl: true } } },
    orderBy: { orderdate: "desc" },
  });
  // 注文単位でグループ化
  const grouped: any = {};
  for (const o of ordersRaw) {
    const key = `${o.orderdate.toISOString()}_${o.creditcardid}`; // 1注文の識別（orderdate+creditcardid）
    if (!grouped[key]) {
      grouped[key] = {
        orderid: o.orderid,
        orderdate: o.orderdate.toISOString(),
        creditcardid: o.creditcardid,
        products: [],
      };
    }
    grouped[key].products.push({
      name: o.product.name,
      imageUrl: o.product.imageUrl,
      price: o.price,
      quantity: o.quantity,
      point: o.point,
    });
  }
  const orders = Object.values(grouped).sort((a: any, b: any) =>
    b.orderdate.localeCompare(a.orderdate)
  );
  return { props: { member, orders } };
};
