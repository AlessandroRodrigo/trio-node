import { makeBikeRepository } from '@/main/factories/make-bike-repository';
import { makeRentalRepository } from '@/main/factories/make-rental-repository';
import { CreateRentalController } from '@/presentation/controllers/create-rental-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRental } from '@/usecases/create-rental';

export const makeCreateRentalController = (): Controller => {
  const rentalRepository = makeRentalRepository();
  const bikeRepository = makeBikeRepository();
  const useCase = new CreateRental(rentalRepository, bikeRepository);
  return new CreateRentalController(useCase);
};
