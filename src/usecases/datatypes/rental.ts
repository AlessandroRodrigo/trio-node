export interface Rental {
  id?: number;
  bikeId: number;
  candidateId: number;
  start: Date;
  subtotal?: number;
  fee?: number;
  total?: number;
  end: Date;
}
