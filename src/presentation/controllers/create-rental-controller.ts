import { Controller, HttpRequest, HttpResponse } from '@/presentation/controllers/ports';
import { UseCase } from '@/usecases/ports/use-case';

export class CreateRentalController implements Controller {
  constructor(private readonly createRentalUseCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const rental = request.body;
      const rentalCreated = await this.createRentalUseCase.perform(rental);
      return {
        statusCode: 200,
        body: rentalCreated,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
