import { useCart } from "../lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiX } from "react-icons/fi";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

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
                      <span style={{ alignSelf: "center" }}>{item.name}</span>
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {item.price}円
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
                      {item.price * item.quantity}円
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
                marginBottom: 16,
              }}
            >
              合計: {total}円
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={clearCart}
                style={{
                  background: "#eee",
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
