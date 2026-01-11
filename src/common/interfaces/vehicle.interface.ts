export interface IVehicle {
  name: string;
  licensePlate: string;
  currentOdo: number;
  initialOdo: number;
  purchaseDate: Date | string;
  profileId?: string;
}
