import { useCart } from "../lib/CartContext";
import { FiShoppingCart, FiTrash2, FiX, FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";

export const CartSidebar = ({ onClose }: { onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

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
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FiShoppingCart size={24} />
          <span style={{ fontWeight: 600, fontSize: 18 }}>カート</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="閉じる"
        >
          <FiX size={24} />
        </button>
      </div>
      {cart.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
          カートは空です
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: 16,
              fontWeight: 600,
              fontSize: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, color: "#666" }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}点の商品
            </span>
            <span>合計: {total.toLocaleString()}円</span>
          </div>
          <Link
            href="/cart"
            style={{
              marginBottom: 16,
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
            カートに移動
          </Link>
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
                  padding: 12,
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
                  <Link
                    href={`/products/${item.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        marginBottom: 4,
                        cursor: "pointer",
                      }}
                    >
                      {item.name}
                    </div>
                  </Link>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
                    単価: {item.price.toLocaleString()}円
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#555" }}>
                      数量: {item.quantity}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: 2,
                          width: 20,
                          height: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#475569",
                          fontSize: 8,
                          fontWeight: "bold",
                          padding: 0,
                        }}
                        title="数量を増やす"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        style={{
                          background:
                            item.quantity <= 1 ? "#f1f5f9" : "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: 2,
                          width: 20,
                          height: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor:
                            item.quantity <= 1 ? "not-allowed" : "pointer",
                          color: item.quantity <= 1 ? "#cbd5e1" : "#475569",
                          fontSize: 8,
                          fontWeight: "bold",
                          padding: 0,
                          opacity: item.quantity <= 1 ? 0.5 : 1,
                        }}
                        title={
                          item.quantity <= 1
                            ? "数量は1未満にできません"
                            : "数量を減らす"
                        }
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: "#000",
                      fontWeight: 600,
                      marginTop: 8,
                      textAlign: "right",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: 8,
                    }}
                  >
                    小計: {(item.price * item.quantity).toLocaleString()}円
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
        </>
      )}
    </aside>
  );
};
