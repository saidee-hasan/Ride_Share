"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const ride_model_1 = require("../ride/ride.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const ride_interface_1 = require("../ride/ride.interface");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const AppError_1 = require("../../errorHelpers/AppError");
const getRideRequest = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const querModel = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find({ rideStatus: ride_interface_1.RideStatus.REQUESTED }), query);
    const availableRide = querModel.sort().paginate();
    const [data, meta] = yield Promise.all([
        availableRide.build(),
        querModel.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getEarningHistory = (query, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const querModel = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find({
        driverId: decodedToken.userId,
        rideStatus: ride_interface_1.RideStatus.COMPLETED,
    }), query);
    const earningHistory = querModel.sort().paginate();
    const totalEarning = ride_model_1.Ride.aggregate([
        {
            $match: {
                driverId: new mongoose_1.Types.ObjectId(decodedToken.userId),
                rideStatus: ride_interface_1.RideStatus.COMPLETED,
            },
        },
        {
            $group: {
                _id: "$driverId",
                totalEarning: { $sum: "$costOfRide" },
            },
        },
    ]);
    const [allData, total, meta] = yield Promise.all([
        earningHistory.build(),
        totalEarning,
        querModel.getMeta(),
    ]);
    return {
        data: { data: allData, totalEarning: total[0].totalEarning },
        meta,
    };
});
const beADriver = (_id, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isOnline = yield user_model_1.User.findById(decodedToken.userId);
    if ((isOnline === null || isOnline === void 0 ? void 0 : isOnline.isOnline) === user_interface_1.IsOnline.OFFLINE) {
        throw new AppError_1.AppError(400, "Currently you are offline.");
    }
    const isDireverReady = yield ride_model_1.Ride.findOne({
        driverId: decodedToken.userId,
        _id: { $ne: _id },
        rideStatus: { $nin: [ride_interface_1.RideStatus.COMPLETED, ride_interface_1.RideStatus.CANCELED] },
    });
    if (isDireverReady) {
        throw new AppError_1.AppError(400, "You are already in a ride. Complete it first.");
    }
    const isRideExist = yield ride_model_1.Ride.findById(_id);
    if (!isRideExist) {
        throw new AppError_1.AppError(404, "Ride request not found.");
    }
    if (isRideExist.riderId === decodedToken.userId) {
        throw new AppError_1.AppError(400, "You can't be your own Driver.");
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.CANCELED) {
        throw new AppError_1.AppError(400, "Ride is canceled.");
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.REQUESTED) {
        if ([
            ride_interface_1.RideStatus.COMPLETED,
            ride_interface_1.RideStatus.PICKED_UP,
            ride_interface_1.RideStatus.IN_TRANSIT,
            ride_interface_1.RideStatus.REQUESTED,
            ride_interface_1.RideStatus.CANCELED,
        ].includes(payload)) {
            throw new AppError_1.AppError(400, "Accept ride first.");
        }
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.ACCEPTED) {
        if (![ride_interface_1.RideStatus.CANCELED, ride_interface_1.RideStatus.PICKED_UP].includes(payload)) {
            throw new AppError_1.AppError(400, "Either pick_up or cancel it.");
        }
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.PICKED_UP) {
        if ([
            ride_interface_1.RideStatus.CANCELED,
            ride_interface_1.RideStatus.PICKED_UP,
            ride_interface_1.RideStatus.ACCEPTED,
            ride_interface_1.RideStatus.COMPLETED,
        ].includes(payload)) {
            throw new AppError_1.AppError(400, "You should proceed furter.");
        }
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.IN_TRANSIT) {
        if ([
            ride_interface_1.RideStatus.CANCELED,
            ride_interface_1.RideStatus.PICKED_UP,
            ride_interface_1.RideStatus.ACCEPTED,
            ride_interface_1.RideStatus.IN_TRANSIT,
        ].includes(payload)) {
            throw new AppError_1.AppError(400, "You should proceed furter.");
        }
    }
    if ((isRideExist === null || isRideExist === void 0 ? void 0 : isRideExist.rideStatus) === ride_interface_1.RideStatus.COMPLETED) {
        throw new AppError_1.AppError(400, "This ride is already completed.");
    }
    const updateDoc = {
        rideStatus: payload,
        driverId: payload === ride_interface_1.RideStatus.ACCEPTED
            ? decodedToken.userId
            : isRideExist.driverId,
    };
    const updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(_id, updateDoc, {
        new: true,
        runValidators: true,
    });
    return {
        data: updatedRide,
    };
});
const pendingRideStatus = (_id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingStatus = yield ride_model_1.Ride.findOne({
        _id: _id,
        driverId: decodedToken.userId,
        rideStatus: {
            $in: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.IN_TRANSIT, ride_interface_1.RideStatus.PICKED_UP],
        },
    });
    return {
        data: pendingStatus,
    };
});
exports.DriverServices = {
    getRideRequest,
    getEarningHistory,
    beADriver,
    pendingRideStatus,
};
