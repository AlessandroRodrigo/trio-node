import { Rental } from '@/usecases/datatypes/rental';
import { ExistingRentalError } from '@/usecases/errors/existing-rental-error';
import { NotFoundBikeError } from '@/usecases/errors/not-found-bike-error';
import { UnauthorizedError } from '@/usecases/errors/unauthorized-error';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import { CandidateRepository } from '@/usecases/ports/candidate-repository';
import { RentalRepository } from '@/usecases/ports/rental-repository';
import { UseCase } from '@/usecases/ports/use-case';

export class CreateRental implements UseCase {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly candidateRepository: CandidateRepository
  ) {}

  async perform(rental: Rental, candidateToken: string): Promise<Rental> {
    const candidate = await this.candidateRepository.findByToken(candidateToken);
    if (!candidate) throw new UnauthorizedError();

    const rentalFound = await this.rentalRepository.findByBikeId(rental.bikeId);
    if (rentalFound) {
      this.validateRentalConflict(rental, rentalFound);
    }

    return this.rentalRepository.add({
      ...rental,
      subtotal: await this.calculateSubtotal(rental),
      fee: await this.calculateFee(rental),
      total: await this.calculateTotal(rental),
    });
  }

  private async calculateSubtotal(rental: Rental): Promise<number> {
    const bikeFound = await this.bikeRepository.findById(rental.bikeId);
    if (!bikeFound) throw new NotFoundBikeError();

    const { rate } = bikeFound;

    const parsedEnd = new Date(rental.end);
    const parsedStart = new Date(rental.start);

    const timeDiff = Math.abs(parsedEnd.getTime() - parsedStart.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return diffDays * rate;
  }

  private async calculateFee(rental: Rental): Promise<number> {
    const subtotal = await this.calculateSubtotal(rental);
    return subtotal * 0.15;
  }

  private async calculateTotal(rental: Rental): Promise<number> {
    const subtotal = await this.calculateSubtotal(rental);
    const fee = await this.calculateFee(rental);
    return subtotal + fee;
  }

  private validateRentalConflict(rental: Rental, existingRental: Rental): void {
    const rentalStart = new Date(rental.start);
    const rentalEnd = new Date(rental.end);
    const existingRentalStart = new Date(existingRental.start);
    const existingRentalEnd = new Date(existingRental.end);

    if (
      (rentalStart >= existingRentalStart && rentalStart <= existingRentalEnd) ||
      (rentalEnd >= existingRentalStart && rentalEnd <= existingRentalEnd)
    ) {
      throw new ExistingRentalError();
    }
  }
}
