import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";

export default function Profile({ member, orders }: any) {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session) return null;
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>会員情報</h1>
      <ul>
        <li>
          <strong>現在のポイント:</strong> {member.memberpoint}
        </li>
        <li>
          <strong>会員ID:</strong> {member.memberid}
        </li>
        <li>
          <strong>名前:</strong> {member.membername}
        </li>
        <li>
          <strong>住所:</strong> {member.address}
        </li>
        <li>
          <strong>電話番号:</strong> {member.phone}
        </li>
      </ul>
      <h2>注文履歴</h2>
      <table
        border="1"
        cellPadding={8}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>日付</th>
            <th>商品ID</th>
            <th>商品名</th>
            <th>価格</th>
            <th>お買い上げ数量</th>
            <th>金額</th>
            <th>ポイント</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7}>注文履歴はありません</td>
            </tr>
          ) : (
            orders.map((order: any) => (
              <tr key={order.orderid}>
                <td>{order.orderdate.slice(0, 10)}</td>
                <td>{order.productid}</td>
                <td>{order.product.name}</td>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
                <td>{order.price * order.quantity}</td>
                <td>{order.point * order.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const member = await prisma.member.findUnique({
    where: { memberid: session.user.email },
    select: {
      memberid: true,
      membername: true,
      address: true,
      phone: true,
      memberpoint: true,
    },
  });
  const orders = await prisma.order.findMany({
    where: { memberid: session.user.email },
    include: { product: { select: { name: true } } },
    orderBy: { orderdate: "desc" },
  });
  const ordersSerialized = orders.map((order) => ({
    ...order,
    orderdate: order.orderdate.toISOString(),
  }));
  return { props: { member, orders: ordersSerialized } };
};
