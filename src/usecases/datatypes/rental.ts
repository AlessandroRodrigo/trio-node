export interface Rental {
  id?: number;
  bikeId: number;
  userId: number;
  start: Date;
  subtotal?: number;
  fee?: number;
  total?: number;
  end: Date;
}
