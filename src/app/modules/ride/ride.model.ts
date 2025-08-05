import { model, Schema } from "mongoose";
import { IDistance, ILoaction, IRide, RideStatus } from "./ride.interface";

const distanceSchema = new Schema<IDistance>(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false, versionKey: false }
);

const locationSchema = new Schema<ILoaction>(
  {
    from: distanceSchema,
    to: distanceSchema,
  },
  { _id: false, versionKey: false }
);

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    driverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    rideStatus: {
      type: String,
      enum: RideStatus,
      default: RideStatus.REQUESTED,
    },
    costOfRide: { type: Number, required: true, min: 10 },
    phone: { type: String, trim: true },
    location: locationSchema,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

rideSchema.virtual("rideTime").get(function () {
  if (!this.createdAt || !this.updatedAt) return null;

  const duration = this.updatedAt.getTime() - this.createdAt.getTime();
  const totalMinutes = Math.floor(duration / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) return "0m";
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
});

export const Ride = model<IRide>("Ride", rideSchema);
