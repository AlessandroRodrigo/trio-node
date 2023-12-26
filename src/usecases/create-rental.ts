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

    const rentalFound = await this.rentalRepository.findByDate(rental.start);
    if (rentalFound) throw new ExistingRentalError();

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

    const timeDiff = Math.abs(rental.end.getTime() - rental.start.getTime());
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
}
