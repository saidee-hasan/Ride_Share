import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../ride/ride.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IRide, RideStatus } from "../ride/ride.interface";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { IsOnline } from "../user/user.interface";
import { AppError } from "../../errorHelpers/AppError";

const getRideRequest = async (query: Record<string, string>) => {
  const querModel = new QueryBuilder(
    Ride.find({ rideStatus: RideStatus.REQUESTED }),
    query
  );

  const availableRide = querModel.sort().paginate();

  const [data, meta] = await Promise.all([
    availableRide.build(),
    querModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getEarningHistory = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const querModel = new QueryBuilder(
    Ride.find({
      driverId: decodedToken.userId,
      rideStatus: RideStatus.COMPLETED,
    }),
    query
  );

  const earningHistory = querModel.sort().paginate();

  const totalEarning = Ride.aggregate([
    {
      $match: {
        driverId: new Types.ObjectId(decodedToken.userId),
        rideStatus: RideStatus.COMPLETED,
      },
    },
    {
      $group: {
        _id: "$driverId",
        totalEarning: { $sum: "$costOfRide" },
      },
    },
  ]);

  const [allData, total, meta] = await Promise.all([
    earningHistory.build(),
    totalEarning,
    querModel.getMeta(),
  ]);

  return {
    data: { data: allData, totalEarning: total[0].totalEarning },
    meta,
  };
};

const beADriver = async (
  _id: string,
  payload: string,
  decodedToken: JwtPayload
) => {
  const isOnline = await User.findById(decodedToken.userId);

  if (isOnline?.isOnline === IsOnline.OFFLINE) {
    throw new AppError(400, "Currently you are offline.");
  }

  const isDireverReady = await Ride.findOne({
    driverId: decodedToken.userId,
    _id: { $ne: _id },
    rideStatus: { $nin: [RideStatus.COMPLETED, RideStatus.CANCELED] },
  });

  if (isDireverReady) {
    throw new AppError(400, "You are already in a ride. Complete it first.");
  }

  const isRideExist = await Ride.findById(_id);

  if (!isRideExist) {
    throw new AppError(404, "Ride request not found.");
  }

  if (isRideExist.riderId === decodedToken.userId) {
    throw new AppError(400, "You can't be your own Driver.");
  }

  if (isRideExist?.rideStatus === RideStatus.CANCELED) {
    throw new AppError(400, "Ride is canceled.");
  }

  if (isRideExist?.rideStatus === RideStatus.REQUESTED) {
    if (
      [
        RideStatus.COMPLETED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
        RideStatus.REQUESTED,
        RideStatus.CANCELED,
      ].includes(payload as RideStatus)
    ) {
      throw new AppError(400, "Accept ride first.");
    }
  }

  if (isRideExist?.rideStatus === RideStatus.ACCEPTED) {
    if (
      ![RideStatus.CANCELED, RideStatus.PICKED_UP].includes(
        payload as RideStatus
      )
    ) {
      throw new AppError(400, "Either pick_up or cancel it.");
    }
  }

  if (isRideExist?.rideStatus === RideStatus.PICKED_UP) {
    if (
      [
        RideStatus.CANCELED,
        RideStatus.PICKED_UP,
        RideStatus.ACCEPTED,
        RideStatus.COMPLETED,
      ].includes(payload as RideStatus)
    ) {
      throw new AppError(400, "You should proceed furter.");
    }
  }

  if (isRideExist?.rideStatus === RideStatus.IN_TRANSIT) {
    if (
      [
        RideStatus.CANCELED,
        RideStatus.PICKED_UP,
        RideStatus.ACCEPTED,
        RideStatus.IN_TRANSIT,
      ].includes(payload as RideStatus)
    ) {
      throw new AppError(400, "You should proceed furter.");
    }
  }

  if (isRideExist?.rideStatus === RideStatus.COMPLETED) {
    throw new AppError(400, "This ride is already completed.");
  }

  const updateDoc: Partial<IRide> = {
    rideStatus: payload as RideStatus,
    driverId:
      payload === RideStatus.ACCEPTED
        ? decodedToken.userId
        : isRideExist.driverId,
  };

  const updatedRide = await Ride.findByIdAndUpdate(_id, updateDoc, {
    new: true,
    runValidators: true,
  });

  return {
    data: updatedRide,
  };
};

const pendingRideStatus = async (_id: string, decodedToken: JwtPayload) => {
  const pendingStatus = await Ride.findOne({
    _id: _id,
    driverId: decodedToken.userId,
    rideStatus: {
      $in: [RideStatus.ACCEPTED, RideStatus.IN_TRANSIT, RideStatus.PICKED_UP],
    },
  });

  return {
    data: pendingStatus,
  };
};

export const DriverServices = {
  getRideRequest,
  getEarningHistory,
  beADriver,
  pendingRideStatus,
};
