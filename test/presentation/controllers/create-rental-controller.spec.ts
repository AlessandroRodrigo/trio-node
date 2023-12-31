import { CreateRentalController } from '@/presentation/controllers/create-rental-controller';
import { HttpRequest } from '@/presentation/controllers/ports/http-request';
import { HttpResponse } from '@/presentation/controllers/ports/http-response';
import { CreateRental } from '@/usecases/create-rental';
import { BikeBuilder } from '@test/builders/bike-builder';
import { CandidateBuilder } from '@test/builders/candidate-builder';
import { ErrorThrowingUseCaseStub } from '@test/doubles/error-throwing-use-case-stub';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';
import { InMemoryCandidateRepository } from '@test/doubles/in-memory-candidate-repository';
import { InMemoryRentalRepository } from '@test/doubles/in-memory-rental-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';

describe('Create rental controller', () => {
  it('should return 201 and the created rental in the body', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const rentalRepository = new InMemoryRentalRepository();
    const useCase = new CreateRental(rentalRepository, bikeRepository, candidateRepository);
    const controller: CreateRentalController = new CreateRentalController(useCase);

    const addedCandidate = new CandidateBuilder().withToken().build();
    const bikeInfo = new BikeBuilder().build();
    const candidate = await candidateRepository.add(addedCandidate);
    bikeRepository.add({
      id: 1,
      candidateId: candidate.id,
      ...bikeInfo,
    });
    bikeRepository.add({
      id: 2,
      candidateId: candidate.id,
      ...bikeInfo,
    });

    const response: HttpResponse = await controller.handle({
      token: candidate.token,
      body: {
        bikeId: 1,
        candidateId: candidate.id,
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 5)),
      },
    } as HttpRequest);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      id: 1,
      bikeId: 1,
      candidateId: candidate.id,
      start: expect.any(Date),
      end: expect.any(Date),
      fee: 7.5,
      subtotal: 50,
      total: 57.5,
    });
  });

  it('should return 500 if use case raises', async () => {
    const useCasestub = new ErrorThrowingUseCaseStub();
    const controller = new CreateRentalController(useCasestub);
    const request: HttpRequest = {
      token: '123456',
      body: {},
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });

  it('should return 401 if user is unauthorized', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const candidateRepository = new InMemoryCandidateRepository();
    const rentalRepository = new InMemoryRentalRepository();
    const useCase = new CreateRental(rentalRepository, bikeRepository, candidateRepository);
    const controller = new CreateRentalController(useCase);
    const request: HttpRequest = {
      token: '123456',
      body: {},
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(401);
  });
});
