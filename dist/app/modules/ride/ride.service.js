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
exports.RideServices = void 0;
const ride_interface_1 = require("./ride.interface");
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../errorHelpers/AppError");
const calculateDistance_1 = require("../../utils/calculateDistance");
const ride_model_1 = require("./ride.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_interface_1 = require("../user/user.interface");
const rideRequest = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    if (!isUserExist.phone) {
        throw new AppError_1.AppError(404, "User must have a valied phone number to request a ride.");
    }
    const isRideExist = yield ride_model_1.Ride.findOne({
        riderId: isUserExist._id,
        rideStatus: {
            $nin: [ride_interface_1.RideStatus.COMPLETED, ride_interface_1.RideStatus.CANCELED],
        },
    });
    if (isRideExist) {
        throw new AppError_1.AppError(400, "Please complete the requested ride first or cancel it.");
    }
    const isDriverAvailable = yield user_model_1.User.find({
        role: user_interface_1.Role.DRIVER,
        isOnline: user_interface_1.IsOnline.ONLINE,
    });
    if (isDriverAvailable.length <= 0) {
        throw new AppError_1.AppError(404, "Sorry currently no driver is available. Please wait or requset later.");
    }
    const { from, to } = payload.location;
    const distanceInKm = (0, calculateDistance_1.calculateDistance)(...[Number(from.lat), Number(from.lng), Number(to.lat), Number(to.lng)]);
    const costOfRide = Math.round(distanceInKm * 60);
    const ridePayload = {
        riderId: isUserExist._id,
        location: payload.location,
        phone: isUserExist.phone,
        costOfRide,
        rideStatus: ride_interface_1.RideStatus.REQUESTED,
    };
    const ride = yield ride_model_1.Ride.create(ridePayload);
    return {
        data: ride,
    };
});
const rideCancel = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isRideExist = yield ride_model_1.Ride.findOne({
        riderId: decodedToken.userId,
        rideStatus: ride_interface_1.RideStatus.REQUESTED,
    });
    if (!isRideExist) {
        throw new AppError_1.AppError(400, "No ride request found. Please request a ride.");
    }
    const updatedRideStatus = yield ride_model_1.Ride.findByIdAndUpdate(isRideExist._id, { rideStatus: ride_interface_1.RideStatus.CANCELED }, { new: true, runValidators: true });
    return {
        data: updatedRideStatus,
    };
});
const rideHistory = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryModel = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find({ riderId: decodedToken.userId }), query);
    const history = queryModel.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([history.build(), history.getMeta()]);
    return {
        data,
        meta,
    };
});
const rideCancelDeletion = () => __awaiter(void 0, void 0, void 0, function* () {
    const deletedRide = yield ride_model_1.Ride.deleteMany({
        rideStatus: ride_interface_1.RideStatus.CANCELED,
    });
    return {
        data: deletedRide,
    };
});
const allRideHistory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryModel = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const history = queryModel.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        history.build(),
        queryModel.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
exports.RideServices = {
    rideRequest,
    rideCancel,
    rideHistory,
    rideCancelDeletion,
    allRideHistory,
};
