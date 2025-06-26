import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useState } from "react";

export default function Home({ products, categories }: any) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const filteredProducts = selectedCategory
    ? products.filter((p: any) => p.categoryId === selectedCategory)
    : products;

  return (
    <div>
      <h1>商品一覧</h1>
      <div style={{ marginBottom: 16 }}>
        <label>カテゴリで絞り込み: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">すべて</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredProducts.length === 0 ? (
          <li>該当する商品がありません</li>
        ) : (
          filteredProducts.map((p: any) => (
            <li key={p.id}>
              {p.name} - {p.price}円（カテゴリ: {p.category.name}）
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  const categories = await prisma.category.findMany();
  return { props: { products, categories } };
};
