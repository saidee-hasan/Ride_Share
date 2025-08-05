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
exports.DriverControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const SendResponse_1 = require("../../utils/SendResponse");
const getRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.DriverServices.getRideRequest(query);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride Request retirve successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getEarningHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverServices.getEarningHistory(query, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride Request retirve successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const beADriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const payload = req.body.status;
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverServices.beADriver(_id, payload, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride status updated",
        data: result.data,
    });
}));
const pendingRideStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverServices.pendingRideStatus(_id, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride status updated",
        data: result.data,
    });
}));
exports.DriverControllers = {
    getRideRequest,
    getEarningHistory,
    beADriver,
    pendingRideStatus,
};
