import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "./login";
import { useRouter } from "next/router";
import { CartProvider, useCart } from "../lib/CartContext";

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
        background: "#f5f5f5",
        marginBottom: "2rem",
      }}
    >
      <Link href="/">
        <span
          style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
        >
          ショッピングサイト
        </span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{ marginRight: 24, position: "relative", cursor: "pointer" }}
          onClick={() => router.push("/cart")}
          aria-label="カート"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
          </svg>
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
                padding: "2px 6px",
                minWidth: 18,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </span>
        {status === "loading" ? null : session ? (
          <>
            <a
              href="/profile"
              onClick={handleProfileClick}
              style={{
                marginRight: 16,
                textDecoration: "underline",
                color: "#0070f3",
                cursor: "pointer",
              }}
            >
              会員情報
            </a>
            <span style={{ marginRight: 16 }}>
              ようこそ、{session.user?.name || session.user?.email} さん
            </span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              ログアウト
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick} style={{ marginRight: 12 }}>
              ログイン
            </button>
            <Link
              href="/register"
              style={{ textDecoration: "underline", color: "#0070f3" }}
            >
              新規登録
            </Link>
          </>
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 32,
                borderRadius: 8,
                minWidth: 350,
                position: "relative",
              }}
            >
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
                >
                  新規登録はこちら
                </Link>
              </div>
            </div>
          </div>
        )}
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}
