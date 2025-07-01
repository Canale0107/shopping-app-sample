import { useCart } from "../lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";

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
                  <th style={{ textAlign: "left" }}>商品</th>
                  <th>価格</th>
                  <th>数量</th>
                  <th>小計</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {item.name}
                    </td>
                    <td>{item.price}円</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        style={{ width: 48 }}
                      />
                    </td>
                    <td>{item.price * item.quantity}円</td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          color: "#e00",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        削除
                      </button>
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
