/*
  Warnings:

  - The primary key for the `Rental` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Rental` table. All the data in the column will be lost.
  - Added the required column `candidateId` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Rental` DROP FOREIGN KEY `Rental_userId_fkey`;

-- AlterTable
ALTER TABLE `Rental` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `candidateId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `candidateId`, `bikeId`);

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
