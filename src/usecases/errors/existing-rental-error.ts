export class ExistingRentalError extends Error {
  public httpStatus = 409;
  constructor() {
    super(`Rental already exists`);
    this.name = 'ExistingRentalError';
  }
}
