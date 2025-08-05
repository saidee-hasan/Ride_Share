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
exports.RideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ride_service_1 = require("./ride.service");
const SendResponse_1 = require("../../utils/SendResponse");
const rideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const result = yield ride_service_1.RideServices.rideRequest(payload, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Request made successfully",
        data: result.data,
    });
}));
const rideCancel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield ride_service_1.RideServices.rideCancel(decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Request cancel successfully",
        data: result.data,
    });
}));
const rideHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const result = yield ride_service_1.RideServices.rideHistory(decodedToken, query);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Ride history retrived successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const rideCancelDeletion = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideServices.rideCancelDeletion();
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Request cancel successfully",
        data: result.data,
    });
}));
const allRideHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield ride_service_1.RideServices.allRideHistory(query);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Ride history retrived successfully",
        data: result.data,
        meta: result.meta,
    });
}));
exports.RideControllers = {
    rideRequest,
    rideCancel,
    rideHistory,
    rideCancelDeletion,
    allRideHistory,
};
