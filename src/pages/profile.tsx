import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
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
  // 日付＋時刻を表示する関数を追加
  function formatDateTime(dt: string) {
    const d = new Date(dt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }
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
                  <div className="profile-point">
                    {member.memberpoint.toLocaleString()} pt
                  </div>
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
                  const total = order.items.reduce(
                    (sum: number, p: any) => sum + p.price * p.quantity,
                    0
                  );
                  const totalPoint = order.items.reduce(
                    (sum: number, p: any) => sum + p.point * p.quantity,
                    0
                  );
                  const totalQty = order.items.reduce(
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
                        <td>{formatDateTime(order.orderdate)}</td>
                        <td>{totalQty.toLocaleString()} 個</td>
                        <td>{total.toLocaleString()} 円</td>
                        <td>{totalPoint.toLocaleString()} pt</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td
                            colSpan={5}
                            style={{ background: "#f7faff", padding: 0 }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 24,
                                padding: "16px 0",
                                margin: "0 24px",
                              }}
                            >
                              {order.items.map((p: any, i: number) => (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    background: "#fff",
                                    borderRadius: 12,
                                    boxShadow: "0 2px 8px rgba(30,64,175,0.08)",
                                    padding: "12px 20px",
                                    minWidth: 320,
                                    marginBottom: 24,
                                  }}
                                >
                                  {p.product.imageUrl && (
                                    <img
                                      src={p.product.imageUrl}
                                      alt={p.product.name}
                                      style={{
                                        width: 56,
                                        height: 56,
                                        objectFit: "contain",
                                        borderRadius: 8,
                                        background: "#f7faff",
                                      }}
                                    />
                                  )}
                                  <div style={{ flex: 1 }}>
                                    <Link
                                      href={`/products/${p.product.id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: 600,
                                          fontSize: 16,
                                          marginBottom: 4,
                                          cursor: "pointer",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        {p.product.name}
                                      </div>
                                    </Link>
                                    <div
                                      style={{
                                        fontSize: 14,
                                        color: "#2563eb",
                                        marginBottom: 2,
                                      }}
                                    >
                                      価格: {p.price.toLocaleString()} 円　数量:{" "}
                                      {p.quantity.toLocaleString()} 個
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 14,
                                        color: "#222",
                                        marginBottom: 2,
                                      }}
                                    >
                                      小計:{" "}
                                      {(p.price * p.quantity).toLocaleString()}{" "}
                                      円　ポイント:{" "}
                                      {(p.point * p.quantity).toLocaleString()}{" "}
                                      pt
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div
                              style={{
                                textAlign: "right",
                                color: "#888",
                                fontSize: 13,
                                margin: "8px 8px 0 0",
                              }}
                            >
                              注文日時: {formatDateTime(order.orderdate)}
                            </div>
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
  const orders = await prisma.order.findMany({
    where: { memberid: session.user.email },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, imageUrl: true } },
        },
      },
    },
    orderBy: { orderdate: "desc" },
  });
  const ordersSerialized = orders.map((order: any) => ({
    ...order,
    orderdate: order.orderdate.toISOString(),
  }));
  return { props: { member, orders: ordersSerialized } };
};
