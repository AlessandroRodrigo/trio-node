import { CreateRental } from '@/usecases/create-rental';
import { BikeBuilder } from '@test/builders/bike-builder';
import { CandidateBuilder } from '@test/builders/candidate-builder';
import { RentalBuilder } from '@test/builders/rental-builder';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';
import { InMemoryCandidateRepository } from '@test/doubles/in-memory-candidate-repository';
import { InMemoryRentalRepository } from '@test/doubles/in-memory-rental-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';

describe('Create rental use case', () => {
  it.only('should create a rental given the dates', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const rentalRepository = new InMemoryRentalRepository();
    const useCase = new CreateRental(rentalRepository, bikeRepository, candidateRepository);

    const addedCandidate = new CandidateBuilder().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);
    const user = await userRepository.add({
      candidateId: candidate.id,
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
    });
    const bike = new BikeBuilder().build();
    const differentBike = new BikeBuilder().different().build();
    const bikesAdded = await Promise.all([
      bikeRepository.add({ id: 1, candidateId: candidate.id, ...bike }),
      bikeRepository.add({ id: 2, candidateId: candidate.id, ...differentBike }),
    ]);
    const rentalInfo = new RentalBuilder().withBikeId(bikesAdded[0].id).withUserId(user.id).build();
    const rentalCreated = await useCase.perform(rentalInfo, candidate.token);

    expect(rentalCreated).toEqual({
      id: expect.any(Number),
      bikeId: bikesAdded[0].id,
      userId: user.id,
      start: rentalInfo.start,
      end: rentalInfo.end,
      fee: 7.5,
      subtotal: 50,
      total: 57.5,
    });
  });
});
