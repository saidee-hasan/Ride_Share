import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
}

export interface IDistance {
  lat: number;
  lng: number;
}

export interface ILoaction {
  from: IDistance;
  to: IDistance;
}

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  rideStatus: RideStatus;
  costOfRide: number;
  phone: string;
  location: ILoaction;
  createdAt?: Date;
  updatedAt?: Date;
}
