import { Rental } from '@/usecases/datatypes/rental';
import { ExistingRentalError } from '@/usecases/errors/existing-rental-error';
import { RentalRepository } from '@/usecases/ports/rental-repository';
import { UseCase } from '@/usecases/ports/use-case';

export class CreateRental implements UseCase {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async perform(rental: Rental): Promise<Rental> {
    const rentalFound = await this.rentalRepository.findByDate(rental.start);
    if (rentalFound) throw new ExistingRentalError();

    return this.rentalRepository.add(rental);
  }
}
