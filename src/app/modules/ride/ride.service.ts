import { JwtPayload } from "jsonwebtoken";
import { ILoaction, IRide, RideStatus } from "./ride.interface";
import { User } from "../user/user.model";
import { AppError } from "../../errorHelpers/AppError";
import { calculateDistance } from "../../utils/calculateDistance";
import { Ride } from "./ride.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IsOnline, Role } from "../user/user.interface";

const rideRequest = async (
  payload: Partial<IRide>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(404, "User not found.");
  }

  if (!isUserExist.phone) {
    throw new AppError(
      404,
      "User must have a valied phone number to request a ride."
    );
  }

  const isRideExist = await Ride.findOne({
    riderId: isUserExist._id,
    rideStatus: {
      $nin: [RideStatus.COMPLETED, RideStatus.CANCELED],
    },
  });

  if (isRideExist) {
    throw new AppError(
      400,
      "Please complete the requested ride first or cancel it."
    );
  }

  const isDriverAvailable = await User.find({
    role: Role.DRIVER,
    isOnline: IsOnline.ONLINE,
  });

  if (isDriverAvailable.length <= 0) {
    throw new AppError(
      404,
      "Sorry currently no driver is available. Please wait or requset later."
    );
  }

  const { from, to } = payload.location as ILoaction;

  const distanceInKm = calculateDistance(
    ...[Number(from.lat), Number(from.lng), Number(to.lat), Number(to.lng)]
  );

  const costOfRide = Math.round(distanceInKm * 60);

  const ridePayload: IRide = {
    riderId: isUserExist._id,
    location: payload.location as ILoaction,
    phone: isUserExist.phone,
    costOfRide,
    rideStatus: RideStatus.REQUESTED,
  };

  const ride = await Ride.create(ridePayload);

  return {
    data: ride,
  };
};

const rideCancel = async (decodedToken: JwtPayload) => {
  const isRideExist = await Ride.findOne({
    riderId: decodedToken.userId,
    rideStatus: RideStatus.REQUESTED,
  });

  if (!isRideExist) {
    throw new AppError(400, "No ride request found. Please request a ride.");
  }

  const updatedRideStatus = await Ride.findByIdAndUpdate(
    isRideExist._id,
    { rideStatus: RideStatus.CANCELED },
    { new: true, runValidators: true }
  );

  return {
    data: updatedRideStatus,
  };
};

const rideHistory = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const queryModel = new QueryBuilder(
    Ride.find({ riderId: decodedToken.userId }),
    query
  );

  const history = queryModel.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([history.build(), history.getMeta()]);

  return {
    data,
    meta,
  };
};

const rideCancelDeletion = async () => {
  const deletedRide = await Ride.deleteMany({
    rideStatus: RideStatus.CANCELED,
  });

  return {
    data: deletedRide,
  };
};

const allRideHistory = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(Ride.find(), query);

  const history = queryModel.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    history.build(),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const RideServices = {
  rideRequest,
  rideCancel,
  rideHistory,
  rideCancelDeletion,
  allRideHistory,
};
