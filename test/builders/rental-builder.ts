import { Rental } from '@/usecases/datatypes/rental';

export class RentalBuilder {
  private rental: Rental = {
    bikeId: 0,
    userId: 0,
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    fee: 10,
    subtotal: 10,
    total: 10,
  };

  withId(): RentalBuilder {
    this.rental.id = 1;
    return this;
  }

  withBikeId(id: number): RentalBuilder {
    this.rental.bikeId = id;
    return this;
  }

  withUserId(id: number): RentalBuilder {
    this.rental.userId = id;
    return this;
  }

  build(): Rental {
    return this.rental;
  }
}
