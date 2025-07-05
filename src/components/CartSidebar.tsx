import { useCart } from "../lib/CartContext";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export const CartSidebar = () => {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside
      style={{
        width: 320,
        minWidth: 240,
        maxWidth: 400,
        background: "#f8fafc",
        borderLeft: "1px solid #e5e7eb",
        padding: "24px 16px",
        boxSizing: "border-box",
        height: "100vh",
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 100,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <FiShoppingCart size={24} />
        <span style={{ fontWeight: 600, fontSize: 18 }}>カート</span>
      </div>
      {cart.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
          カートは空です
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(30,64,175,0.06)",
                padding: 8,
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
                    borderRadius: 4,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {item.price.toLocaleString()}円 × {item.quantity}
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e00",
                  cursor: "pointer",
                  padding: 4,
                }}
                title="削除"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          marginTop: 16,
          fontWeight: 600,
          fontSize: 16,
          textAlign: "right",
        }}
      >
        合計: {total.toLocaleString()}円
      </div>
      <Link
        href="/cart"
        style={{
          marginTop: 24,
          display: "block",
          background: "#2563eb",
          color: "#fff",
          textAlign: "center",
          borderRadius: 6,
          padding: "12px 0",
          fontWeight: 600,
          textDecoration: "none",
          fontSize: 16,
          letterSpacing: 1,
        }}
      >
        カートを見る
      </Link>
    </aside>
  );
};
