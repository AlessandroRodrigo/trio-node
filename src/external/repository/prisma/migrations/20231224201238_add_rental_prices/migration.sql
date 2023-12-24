/*
  Warnings:

  - Added the required column `fees` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Rental` ADD COLUMN `fees` DOUBLE NOT NULL,
    ADD COLUMN `subtotal` DOUBLE NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;
