import { Controller, HttpRequest, HttpResponse } from '@/presentation/controllers/ports';
import { UseCase } from '@/usecases/ports/use-case';

export class CreateRentalController implements Controller {
  constructor(private readonly createRentalUseCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const rental = request.body;
      const candidateToken = request.token;
      const rentalCreated = await this.createRentalUseCase.perform(rental, candidateToken);
      return {
        statusCode: 201,
        body: rentalCreated,
      };
    } catch (error) {
      const userUnauthorized = error.constructor.name === 'UnauthorizedError';

      if (userUnauthorized) {
        return {
          statusCode: error.httpStatus,
          body: {
            errorType: error.constructor.name,
            message: error.message,
          },
        };
      }

      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
