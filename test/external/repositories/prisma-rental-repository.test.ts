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
    const user = await userRepo.add({
      candidateId: candidate.id,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    const rentalInfo = new RentalBuilder().withBikeId(bike.id).withUserId(user.id).build();
    const rental = await rentalRepo.add(rentalInfo);

    expect(rental).toEqual({
      id: expect.any(Number),
      bikeId: bike.id,
      userId: user.id,
      start: rentalInfo.start,
      end: rentalInfo.end,
      fee: rentalInfo.fee,
      subtotal: rentalInfo.subtotal,
      total: rentalInfo.total,
    });
  });
});
