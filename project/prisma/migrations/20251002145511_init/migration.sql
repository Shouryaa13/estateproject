/*
  Warnings:

  - The primary key for the `Inquiry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Visit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `propertyId` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Visit" DROP CONSTRAINT "Visit_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Visit" DROP CONSTRAINT "Visit_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Inquiry_id_seq";

-- AlterTable
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Listing_id_seq";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "public"."Visit" DROP CONSTRAINT "Visit_pkey",
DROP COLUMN "propertyId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "listingId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Visit_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Visit_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
