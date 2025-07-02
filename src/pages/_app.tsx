import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "./login";
import { useRouter } from "next/router";
import { CartProvider, useCart } from "../lib/CartContext";
import "../styles/global.css";
import { Modal } from "../components/Modal";
import { FiUser, FiLogIn, FiLogOut, FiShoppingCart } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";

function Header({ onLoginClick }: { onLoginClick: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart } = useCart();
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      onLoginClick();
    } else {
      router.push("/profile");
    }
  };
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        marginBottom: "2rem",
      }}
    >
      <Link href="/">
        <span
          className="header-logo"
          style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
        >
          ショッピングサイト
        </span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {status === "loading" ? null : session ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontWeight: "bold", color: "#fff", marginRight: 4 }}>
              ようこそ、{session.user?.name || session.user?.email} さん
            </span>
            <span
              onClick={handleProfileClick}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="会員情報"
              aria-label="会員情報"
            >
              <HiOutlineUserCircle size={28} />
            </span>
            <span
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="ログアウト"
              aria-label="ログアウト"
            >
              <FiLogOut size={28} />
            </span>
            <span
              style={{ marginLeft: 0, position: "relative", cursor: "pointer" }}
              onClick={() => router.push("/cart")}
              aria-label="カート"
              title="カート"
            >
              <FiShoppingCart size={28} />
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    background: "#e00",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: 12,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: "bold",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span
              onClick={onLoginClick}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="ログイン"
              aria-label="ログイン"
            >
              <FiLogIn size={28} />
            </span>
            <Link href="/register" legacyBehavior>
              <a
                className="register-btn"
                style={{
                  background: "#fff",
                  color: "#2563eb",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  marginLeft: 8,
                  textDecoration: "none",
                  border: "none",
                  display: "inline-block",
                  transition: "background 0.2s, color 0.2s",
                  boxShadow: "0 1px 4px rgba(30,64,175,0.04)",
                  cursor: "pointer",
                }}
              >
                新規登録
              </a>
            </Link>
            <span
              style={{ marginLeft: 0, position: "relative", cursor: "pointer" }}
              onClick={() => router.push("/cart")}
              aria-label="カート"
              title="カート"
            >
              <FiShoppingCart size={28} />
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    background: "#e00",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: 12,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: "bold",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </span>
          </div>
        )}
      </nav>
    </header>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Header onLoginClick={() => setShowLoginModal(true)} />
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
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}
