import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useCart } from "../lib/CartContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home({
  categories,
  products,
  selectedCategoryId,
}: any) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButtonId, setClickedButtonId] = useState<string | null>(null);
  const [isCartButtonPressed, setIsCartButtonPressed] = useState(false);

  // router.queryから直接カテゴリIDを取得
  const currentCategoryId =
    (router.query.category as string) || selectedCategoryId;

  // カードアニメーションのvariants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  // カテゴリアニメーションのvariants
  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  // カテゴリ選択時の処理
  const handleCategorySelect = (categoryId: string) => {
    if (currentCategoryId === categoryId) return; // 同じカテゴリの場合は何もしない

    // URLを更新
    router
      .push(`/?category=${categoryId}`, undefined, {
        shallow: true,
        scroll: false,
      })
      .catch((error) => {
        console.error("Navigation error:", error);
      });
  };

  // カテゴリ一覧に戻る処理
  const handleBackToCategories = () => {
    // 直接ルートパスに遷移してクエリパラメータをクリア
    router.push("/").catch((error) => {
      console.error("Navigation error:", error);
    });
  };

  // 商品一覧表示
  if (currentCategoryId) {
    const selectedCategory = categories.find(
      (cat: any) => cat.id === currentCategoryId
    );
    const filteredProducts = products.filter(
      (p: any) => p.categoryId === currentCategoryId
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="main-area"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1>{selectedCategory?.name}の商品一覧</h1>
          <motion.button
            onClick={handleBackToCategories}
            style={{ marginBottom: 16 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← カテゴリ一覧に戻る
          </motion.button>
        </motion.div>

        {
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 24 }}
          >
            {filteredProducts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: "100%", textAlign: "center", padding: "2rem" }}
              >
                該当する商品がありません
              </motion.p>
            ) : (
              filteredProducts.map((p: any, index: number) => (
                <motion.div
                  key={p.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 16,
                    width: 180,
                    textAlign: "center",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                  whileHover="hover"
                  whileTap={!isCartButtonPressed ? "tap" : undefined}
                  onClick={() => router.push(`/products/${p.id}`)}
                >
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        marginBottom: 8,
                      }}
                    />
                  )}
                  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#0070f3",
                      fontSize: "1.1rem",
                      marginBottom: 12,
                    }}
                  >
                    {p.price.toLocaleString()}円
                  </div>
                  <motion.button
                    style={{
                      width: "100%",
                      background: "#0070f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 0",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                    onPointerDown={() => setIsCartButtonPressed(true)}
                    onPointerUp={() => setIsCartButtonPressed(false)}
                    onPointerLeave={() => setIsCartButtonPressed(false)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setClickedButtonId(p.id);
                      addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        imageUrl: p.imageUrl,
                      });
                      setTimeout(() => setClickedButtonId(null), 150);
                    }}
                    whileHover={{ scale: 1.05, background: "#0051a8" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    カートに追加
                  </motion.button>
                </motion.div>
              ))
            )}
          </motion.div>
        }
      </motion.div>
    );
  }

  // カテゴリ一覧表示
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="main-area"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        カテゴリ一覧
      </motion.h1>

      {
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 24 }}
        >
          {categories.map((cat: any, index: number) => {
            const key = cat.id.replace("cat-", "");
            const imageUrl = `/images/products/${key}_01.png`;

            return (
              <motion.div
                key={cat.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={categoryVariants}
                onClick={() => handleCategorySelect(cat.id)}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  width: 180,
                  cursor: "pointer",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
                whileHover="hover"
                whileTap="tap"
              >
                <img
                  src={imageUrl}
                  alt={cat.name}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#333",
                  }}
                >
                  {cat.name}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      }
    </motion.div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const selectedCategoryId =
    typeof ctx.query.category === "string" ? ctx.query.category : "";
  return { props: { categories, products, selectedCategoryId } };
};
