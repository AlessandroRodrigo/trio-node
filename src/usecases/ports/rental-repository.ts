import { Rental } from '@/usecases/datatypes/rental';

export interface RentalRepository {
  add(rental: Rental): Promise<Rental>;
  findByDate(date: Date): Promise<Rental>;
}
