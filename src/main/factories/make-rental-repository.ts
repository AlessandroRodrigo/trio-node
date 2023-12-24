import { PrismaRentalRepository } from '@/external/repository/prisma/prisma-rental-repository';
import { RentalRepository } from '@/usecases/ports/rental-repository';

export const makeRentalRepository = (): RentalRepository => {
  return new PrismaRentalRepository();
};
