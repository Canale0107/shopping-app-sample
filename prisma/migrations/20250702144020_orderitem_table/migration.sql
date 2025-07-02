/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - The required column `id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productid_fkey";

-- Drop old Order table (and cascade to dependent data)
DROP TABLE IF EXISTS "Order" CASCADE;
-- Create new Order table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberid" TEXT NOT NULL,
    "orderdate" TIMESTAMP(3) NOT NULL,
    "creditcardid" TEXT NOT NULL
);
-- Create new OrderItem table
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productid" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productid_fkey" FOREIGN KEY ("productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Add relation from Order to Member
ALTER TABLE "Order" ADD CONSTRAINT "Order_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "Member"("memberid") ON DELETE RESTRICT ON UPDATE CASCADE;
