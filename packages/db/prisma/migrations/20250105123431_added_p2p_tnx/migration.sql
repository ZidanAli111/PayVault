/*
  Warnings:

  - You are about to drop the column `userId` on the `p2pTransfer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "p2pTransfer" DROP CONSTRAINT "p2pTransfer_userId_fkey";

-- AlterTable
ALTER TABLE "p2pTransfer" DROP COLUMN "userId";
