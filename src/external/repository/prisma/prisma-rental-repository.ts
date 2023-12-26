import prismaClient from '@/external/repository/prisma/prisma-client';
import { Rental } from '@/usecases/datatypes/rental';
import { RentalRepository } from '@/usecases/ports/rental-repository';

export class PrismaRentalRepository implements RentalRepository {
  async findByDate(date: Date): Promise<Rental> {
    return await prismaClient.rental.findFirst({
      where: {
        start: {
          gte: date,
        },
        end: {
          lte: date,
        },
      },
    });
  }

  async add(rental: Rental): Promise<Rental> {
    return prismaClient.rental.create({
      data: {
        bikeId: rental.bikeId,
        candidateId: rental.candidateId,
        start: rental.start,
        end: rental.end,
        fee: rental.fee,
        subtotal: rental.subtotal,
        total: rental.total,
      },
    });
  }
}
