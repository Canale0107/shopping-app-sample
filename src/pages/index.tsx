import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Link from "next/link";

export default function Home({
  categories,
  products,
  selectedCategoryId,
}: any) {
  // カテゴリ選択時は商品一覧を表示
  if (selectedCategoryId) {
    const selectedCategory = categories.find(
      (cat: any) => cat.id === selectedCategoryId
    );
    const filteredProducts = products.filter(
      (p: any) => p.categoryId === selectedCategoryId
    );
    return (
      <div>
        <h1>{selectedCategory?.name}の商品一覧</h1>
        <button
          onClick={() => (window.location.href = "/")}
          style={{ marginBottom: 16 }}
        >
          カテゴリ一覧に戻る
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {filteredProducts.length === 0 ? (
            <p>該当する商品がありません</p>
          ) : (
            filteredProducts.map((p: any) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  width: 180,
                  textAlign: "center",
                }}
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
                <div>{p.name}</div>
                <div style={{ fontWeight: "bold" }}>{p.price}円</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // カテゴリ一覧
  return (
    <div>
      <h1>カテゴリ一覧</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        {categories.map((cat: any) => {
          // 代表画像のルール: /images/products/{カテゴリ名}_01.png
          const key = cat.id.replace("cat-", "");
          const imageUrl = `/images/products/${key}_01.png`;
          return (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              style={{
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  width: 180,
                  cursor: "pointer",
                }}
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
                <div style={{ fontWeight: "bold", fontSize: 18 }}>
                  {cat.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const selectedCategoryId =
    typeof ctx.query.category === "string" ? ctx.query.category : "";
  return { props: { categories, products, selectedCategoryId } };
};
