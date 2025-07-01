import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "./login";
import { useRouter } from "next/router";

function Header({ onLoginClick }: { onLoginClick: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      <nav>
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
    </SessionProvider>
  );
}
