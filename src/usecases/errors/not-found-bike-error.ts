export class NotFoundBikeError extends Error {
  public httpStatus = 404;
  constructor() {
    super(`Bike not found`);
    this.name = 'NotFoundBikeError';
  }
}
