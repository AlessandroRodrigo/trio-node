import { Rental } from '@/usecases/datatypes/rental';

export class RentalBuilder {
  private rental: Rental = {
    bikeId: 0,
    candidateId: 0,
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

  withCandidateId(id: number): RentalBuilder {
    this.rental.candidateId = id;
    return this;
  }

  build(): Rental {
    return this.rental;
  }
}
