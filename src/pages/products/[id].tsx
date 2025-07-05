import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "../../lib/CartContext";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface ProductDetailProps {
  product: Product | null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>商品が見つかりません</h1>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "12px 24px",
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            ホームに戻る
          </motion.button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || undefined,
      },
      quantity
    );
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      {/* 戻るボタン */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: "2rem" }}
      >
        <Link href={`/?category=${product.categoryId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            <FiArrowLeft size={16} />
            {product.category.name}に戻る
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* 商品画像 */}
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 400,
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                画像なし
              </div>
            )}
          </motion.div>
        </div>

        {/* 商品情報 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#2563eb",
                marginBottom: "1rem",
              }}
            >
              ¥{product.price.toLocaleString()}
            </div>

            {product.description && (
              <p
                style={{ color: "#666", lineHeight: 1.6, marginBottom: "2rem" }}
              >
                {product.description}
              </p>
            )}

            {/* 数量選択 */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
                数量
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{
                    background: quantity <= 1 ? "#f3f4f6" : "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    color: quantity <= 1 ? "#9ca3af" : "#475569",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  -
                </button>

                <span
                  style={{
                    minWidth: 60,
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 18,
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#475569",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* カートに追加ボタン */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              style={{
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "16px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: "2rem",
              }}
            >
              <FiShoppingCart size={20} />
              {isAddingToCart ? "追加中..." : "カートに追加"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id || typeof id !== "string") {
    return {
      props: {
        product: null,
      },
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    return {
      props: {
        product: product ? JSON.parse(JSON.stringify(product)) : null,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      props: {
        product: null,
      },
    };
  }
};
