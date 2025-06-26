import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";

function Header() {
  const { data: session, status } = useSession();
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
            <Link
              href="/profile"
              style={{
                marginRight: 16,
                textDecoration: "underline",
                color: "#0070f3",
              }}
            >
              会員情報
            </Link>
            <span style={{ marginRight: 16 }}>
              ようこそ、{session.user?.name || session.user?.email} さん
            </span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              ログアウト
            </button>
          </>
        ) : (
          <button onClick={() => signIn(undefined, { callbackUrl: "/" })}>
            ログイン
          </button>
        )}
      </nav>
    </header>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
