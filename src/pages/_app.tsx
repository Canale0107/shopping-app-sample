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
import { motion, AnimatePresence } from "framer-motion";
import { CartSidebar } from "../components/CartSidebar";

function Header({
  onLoginClick,
  onCartToggle,
  isCartPage,
}: {
  onLoginClick: () => void;
  onCartToggle: () => void;
  isCartPage: boolean;
}) {
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
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        marginBottom: "2rem",
        background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
      }}
    >
      <Link href="/">
        <motion.span
          className="header-logo"
          style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ショッピングサイト
        </motion.span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {status === "loading" ? null : session ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <motion.span
              style={{
                fontWeight: "bold",
                color: "#fff",
                marginRight: 4,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => router.push("/profile")}
              title="会員情報"
              aria-label="会員情報"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ようこそ、{session.user?.name || session.user?.email} さん
            </motion.span>
            <motion.span
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="ログアウト"
              aria-label="ログアウト"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLogOut size={28} />
            </motion.span>
            {!isCartPage && (
              <motion.span
                style={{
                  marginLeft: 0,
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={onCartToggle}
                aria-label="カート"
                title="カート"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShoppingCart size={28} />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
                  </motion.span>
                )}
              </motion.span>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <motion.span
              onClick={onLoginClick}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="ログイン"
              aria-label="ログイン"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLogIn size={28} />
            </motion.span>
            <Link href="/register" legacyBehavior>
              <motion.a
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
                whileHover={{ scale: 1.05, background: "#f8fafc" }}
                whileTap={{ scale: 0.95 }}
              >
                新規登録
              </motion.a>
            </Link>
            {!isCartPage && (
              <motion.span
                style={{
                  marginLeft: 0,
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={onCartToggle}
                aria-label="カート"
                title="カート"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShoppingCart size={28} />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
                  </motion.span>
                )}
              </motion.span>
            )}
          </div>
        )}
      </nav>
    </motion.header>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const router = useRouter();
  const isCartPage = router.pathname.startsWith("/cart");

  const handleCartToggle = () => {
    setShowCartSidebar(!showCartSidebar);
  };

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div
            style={{
              flex: 1,
              marginRight: isCartPage || !showCartSidebar ? 0 : 320,
              minWidth: 0,
            }}
          >
            <Header
              onLoginClick={() => setShowLoginModal(true)}
              onCartToggle={handleCartToggle}
              isCartPage={isCartPage}
            />
            <AnimatePresence mode="wait">
              {showLoginModal && (
                <Modal
                  key="login-modal"
                  onClose={() => setShowLoginModal(false)}
                >
                  <motion.button
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
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
            </AnimatePresence>
            <Component {...pageProps} />
          </div>
          {!isCartPage && showCartSidebar && (
            <CartSidebar onClose={() => setShowCartSidebar(false)} />
          )}
        </div>
      </CartProvider>
    </SessionProvider>
  );
}
