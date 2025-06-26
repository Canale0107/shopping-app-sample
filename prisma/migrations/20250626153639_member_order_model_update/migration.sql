/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creditCard` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creditcardid` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberid` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderdate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - The required column `orderid` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `point` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productid` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userEmail_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "creditCard",
DROP COLUMN "id",
DROP COLUMN "orderDate",
DROP COLUMN "productId",
DROP COLUMN "userEmail",
ADD COLUMN     "creditcardid" TEXT NOT NULL,
ADD COLUMN     "memberid" TEXT NOT NULL,
ADD COLUMN     "orderdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderid" TEXT NOT NULL,
ADD COLUMN     "point" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "productid" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderid");

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Member" (
    "memberid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "membername" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "memberpoint" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberid_key" ON "Member"("memberid");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "Member"("memberid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productid_fkey" FOREIGN KEY ("productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
