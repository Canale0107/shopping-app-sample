import { useCart } from "../../lib/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function CartConfirmPage() {
  const { cart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
        credentials: "include",
      });
      if (res.ok) {
        clearCart();
        router.push("/cart/complete");
      } else {
        const data = await res.json();
        setError(data.error || "注文に失敗しました");
      }
    } catch (e) {
      setError("注文に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", margin: 40 }}>
        <p>カートは空です</p>
        <Link href="/">
          <span
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            商品一覧へ戻る
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>購入内容の確認</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ textAlign: "left" }}>商品</th>
            <th>価格</th>
            <th>数量</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: 40, height: 40, objectFit: "contain" }}
                  />
                )}
                {item.name}
              </td>
              <td>{item.price}円</td>
              <td>{item.quantity}</td>
              <td>{item.price * item.quantity}円</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          fontSize: 18,
          marginBottom: 16,
        }}
      >
        合計: {total}円
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {status === "loading" ? null : !session ? (
        <div style={{ margin: "24px 0", textAlign: "center" }}>
          <p>注文にはログインが必要です。</p>
          <Link href="/login">
            <span
              style={{
                color: "#0070f3",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              ログイン画面へ
            </span>
          </Link>
        </div>
      ) : (
        <button
          onClick={handleOrder}
          disabled={loading}
          style={{
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "10px 32px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {loading ? "注文中..." : "注文を確定する"}
        </button>
      )}
    </div>
  );
}
