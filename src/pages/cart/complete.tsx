import Link from "next/link";

export default function CartCompletePage() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h1>ご注文ありがとうございました！</h1>
      <p>ご注文が正常に完了しました。</p>
      <div style={{ marginTop: 32 }}>
        <Link href="/">
          <span
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              cursor: "pointer",
              marginRight: 24,
            }}
          >
            トップへ戻る
          </span>
        </Link>
        <Link href="/profile">
          <span
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            注文履歴を見る
          </span>
        </Link>
      </div>
    </div>
  );
}
