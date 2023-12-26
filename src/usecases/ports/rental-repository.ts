import { Rental } from '@/usecases/datatypes/rental';

export interface RentalRepository {
  add(rental: Rental): Promise<Rental>;
  findByBikeId(bikeId: number): Promise<Rental>;
}
