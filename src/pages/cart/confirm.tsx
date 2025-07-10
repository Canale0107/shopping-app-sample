import { useCart } from "../../lib/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LoginForm } from "../login";
import { Modal } from "../../components/Modal";

export default function CartConfirmPage() {
  const { cart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [memberPoint, setMemberPoint] = useState<number>(0);
  const [usePoint, setUsePoint] = useState<string>("0");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // 商品ごとのポイント合計（Product.point * quantity）
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

  // 会員ポイント取得
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/member", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.memberpoint === "number")
          setMemberPoint(data.memberpoint);
      });
  }, [session]);
  // 割引後の合計
  const finalTotal = Math.max(0, total - (Number(usePoint) || 0));

  const handleOrder = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, usePoint: Number(usePoint) || 0 }),
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
    <div className="main-area">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1>購入内容の確認</h1>
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
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid #eee", height: 72 }}
              >
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    verticalAlign: "middle",
                    height: 72,
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
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.price.toLocaleString()}円
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {item.quantity}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {(item.price * item.quantity).toLocaleString()}円
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
          合計: {total.toLocaleString()}円
        </div>
        <div
          style={{
            textAlign: "right",
            fontWeight: 500,
            fontSize: 18,
            margin: "16px 0",
          }}
        >
          獲得予定ポイント: {totalPoint.toLocaleString()} pt
        </div>
        <div
          style={{
            textAlign: "right",
            fontWeight: 500,
            fontSize: 18,
            margin: "16px 0",
          }}
        >
          利用可能ポイント: {memberPoint.toLocaleString()} pt
        </div>
        <div
          style={{
            textAlign: "right",
            fontWeight: 500,
            fontSize: 18,
            margin: "16px 0",
          }}
        >
          <label>
            利用ポイント:{" "}
            <input
              type="number"
              min={0}
              max={Math.min(memberPoint, total)}
              value={usePoint}
              onChange={(e) => {
                // 数値のみ許容、空欄も許容
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setUsePoint(val);
                }
              }}
              onBlur={() => {
                if (usePoint === "") setUsePoint("0");
              }}
              style={{ width: 100, fontSize: 16, marginLeft: 8 }}
            />{" "}
            pt
          </label>
        </div>
        <div
          style={{
            textAlign: "right",
            fontWeight: "bold",
            fontSize: 20,
            margin: "16px 0",
          }}
        >
          割引後合計: {finalTotal.toLocaleString()}円
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => router.push("/cart")}
            style={{
              background: "#fff",
              color: "#2563eb",
              borderRadius: 6,
              border: "1px solid #2563eb",
              padding: "8px 18px",
              fontWeight: 500,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(30,64,175,0.04)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            カートに戻る
          </button>
          {status === "loading" ? null : !session ? (
            <button
              onClick={() => setShowLoginModal(true)}
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
              ログインして注文する
            </button>
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
        {showLoginModal && (
          <Modal onClose={() => setShowLoginModal(false)}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: 18,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="閉じる"
            >
              ×
            </button>
            <LoginForm onSuccess={() => setShowLoginModal(false)} />
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link
                href="/register"
                style={{ textDecoration: "underline", color: "#0070f3" }}
                onClick={() => setShowLoginModal(false)}
              >
                新規登録はこちら
              </Link>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
