import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum RoleStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}

export enum IsOnline {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum IVehicle {
  CAR = "CAR",
  BIKE = "BIKE",
}

export interface IAuthProviders {
  provider: "credentials" | "google";
  providerId: string;
}

export interface IRoleChange {
  userId: Types.ObjectId;
  currentRole: Role;
  requestedRole: Role;
  status: RoleStatus;
  Vehicle?: IVehicle | null;
}

export interface IUser {
  name: string;
  auth: IAuthProviders[];
  role: Role;
  email: string;
  password?: string;
  phone: string;
  address?: string;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  picture?: string;
  isOnline?: IsOnline;
  Vehicle?: IVehicle | null;
  createdAt?: Date;
}
