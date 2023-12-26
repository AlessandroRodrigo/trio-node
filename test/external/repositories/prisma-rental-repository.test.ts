import { PrismaBikeRepository } from '@/external/repository/prisma/prisma-bike-repository';
import { PrismaCandidateRepository } from '@/external/repository/prisma/prisma-candidate-repository';
import { PrismaRentalRepository } from '@/external/repository/prisma/prisma-rental-repository';
import { PrismaUserRepository } from '@/external/repository/prisma/prisma-user-repository';
import { BikeBuilder } from '@test/builders/bike-builder';
import { RentalBuilder } from '@test/builders/rental-builder';
import { clearPrismaDatabase } from '@test/main/routes/clear-database';

describe('Rental prisma repository', () => {
  it('should be able to create a rental', async () => {
    await clearPrismaDatabase();
    const candidateRepo = new PrismaCandidateRepository();
    const userRepo = new PrismaUserRepository();
    const bikeRepo = new PrismaBikeRepository();
    const rentalRepo = new PrismaRentalRepository();

    const candidate = await candidateRepo.add({
      name: 'any_name',
      email: 'any_email',
      token: 'any_token',
    });
    const bikeInfo = new BikeBuilder().build();
    const bike = await bikeRepo.add({
      candidateId: candidate.id,
      ...bikeInfo,
    });

    const rentalInfo = new RentalBuilder()
      .withBikeId(bike.id)
      .withCandidateId(candidate.id)
      .build();
    const rental = await rentalRepo.add(rentalInfo);

    expect(rental).toEqual({
      id: expect.any(Number),
      bikeId: bike.id,
      candidateId: candidate.id,
      start: rentalInfo.start,
      end: rentalInfo.end,
      fee: rentalInfo.fee,
      subtotal: rentalInfo.subtotal,
      total: rentalInfo.total,
    });
  });
});
