import { Rental } from '@/usecases/datatypes/rental';
import { RentalRepository } from '@/usecases/ports/rental-repository';

export class InMemoryRentalRepository implements RentalRepository {
  private rentals: Rental[] = [];
  private currentId = 1;

  async add(rental: Rental): Promise<Rental> {
    const newRental = { ...rental, id: this.currentId++ };
    this.rentals.push(newRental);
    return newRental;
  }

  async findByDate(date: Date): Promise<Rental> {
    return this.rentals.find((rental) => rental.start === date);
  }
}
