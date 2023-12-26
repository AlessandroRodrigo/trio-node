/*
  Warnings:

  - You are about to drop the column `fees` on the `Rental` table. All the data in the column will be lost.
  - Added the required column `fee` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Rental` DROP COLUMN `fees`,
    ADD COLUMN `fee` DOUBLE NOT NULL;
