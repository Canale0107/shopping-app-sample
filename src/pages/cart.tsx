import { useCart } from "../lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();
  const [pointMap, setPointMap] = useState<{ [id: string]: number }>({});
  const totalPoint = cart.reduce(
    (sum, item) => sum + (pointMap[item.id] || 0) * item.quantity,
    0
  );
  // 商品ポイントを取得
  useEffect(() => {
    if (cart.length === 0) return;
    const fetchPoints = async () => {
      const res = await fetch("/api/products/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: cart.map((item) => item.id) }),
      });
      if (res.ok) {
        const data = await res.json();
        setPointMap(data);
      }
    };
    fetchPoints();
  }, [cart]);

  return (
    <div className="main-area">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1>ショッピングカート</h1>
        {cart.length === 0 ? (
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
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 24,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #ccc" }}>
                  <th style={{ width: 48 }}></th>
                  <th style={{ textAlign: "left" }}>商品</th>
                  <th>価格</th>
                  <th>数量</th>
                  <th>小計</th>
                  <th>ポイント小計</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #eee", height: 80 }}
                  >
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="カートから削除"
                      >
                        <FiX size={32} color="#888" />
                      </button>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        verticalAlign: "middle",
                        height: 80,
                      }}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      )}
                      <Link
                        href={`/products/${item.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span
                          style={{
                            alignSelf: "center",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {item.price.toLocaleString()}円
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        style={{
                          width: 80,
                          textAlign: "center",
                          height: 36,
                          fontSize: 16,
                          verticalAlign: "middle",
                          margin: 0,
                        }}
                      />
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {(item.price * item.quantity).toLocaleString()}円
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {(pointMap[item.id] || 0) * item.quantity}pt
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              合計ポイント: {totalPoint.toLocaleString()}pt
            </div>
            <div
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 16,
              }}
            >
              合計: {total.toLocaleString()}円
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={clearCart}
                style={{
                  background: "#bbb",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                カートを空にする
              </button>
              <button
                style={{
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 24px",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/cart/confirm")}
              >
                購入する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
