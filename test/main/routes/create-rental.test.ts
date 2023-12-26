import prismaClient from '@/external/repository/prisma/prisma-client';
import app from '@/main/config/app';
import { BikeBuilder } from '@test/builders/bike-builder';
import request from 'supertest';
import { clearPrismaDatabase } from './clear-database';

describe('Create rental route', () => {
  it('create rental should return created rental and 200', async () => {
    await clearPrismaDatabase();
    const candidateCreated = await prismaClient.candidate.create({
      data: {
        email: 'first@candidate.com',
        name: 'First Candidate',
        token: 'a-token',
      },
    });
    const userCreated = await prismaClient.user.create({
      data: {
        email: 'any_email',
        name: 'any_name',
        password: 'any_password',
        candidate: {
          connect: {
            id: candidateCreated.id,
          },
        },
      },
    });
    const bikeInfo = new BikeBuilder().build();
    const bikeCreated = await prismaClient.bike.create({
      data: {
        bodySize: bikeInfo.bodySize,
        description: bikeInfo.description,
        maxLoad: bikeInfo.maxLoad,
        name: bikeInfo.name,
        rate: bikeInfo.rate,
        ratings: bikeInfo.ratings,
        type: bikeInfo.type,
        candidate: {
          connect: {
            id: candidateCreated.id,
          },
        },
        imageUrls: {
          create: bikeInfo.imageUrls.map((imageUrl) => ({ url: imageUrl })),
        },
      },
    });

    await request(app)
      .post('/api/rentals')
      .set('authorization', 'a-token')
      .send({
        bikeId: bikeCreated.id,
        userId: userCreated.id,
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 5)),
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toBeTruthy();
      });
  });
});
