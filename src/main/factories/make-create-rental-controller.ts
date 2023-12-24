import { makeRentalRepository } from '@/main/factories/make-rental-repository';
import { CreateRentalController } from '@/presentation/controllers/create-rental-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRental } from '@/usecases/create-rental';

export const makeCreateRentalController = (): Controller => {
  const rentalRepository = makeRentalRepository();
  const useCase = new CreateRental(rentalRepository);
  return new CreateRentalController(useCase);
};
