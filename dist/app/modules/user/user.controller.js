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
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const SendResponse_1 = require("../../utils/SendResponse");
const createUsreToken_1 = require("../../utils/createUsreToken");
const setCookies_1 = require("../../utils/setCookies");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully.",
        data: result.data,
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserServices.getAllUser(query);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User retrived successfully.",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const result = yield user_service_1.UserServices.getSingleUser(_id);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User retrived successfully.",
        data: result.data,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.UserServices.getMe(user.userId);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User retrived successfully.",
        data: result.data,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const decodedToken = req.user;
    const result = yield user_service_1.UserServices.updateUser(userId, payload, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User updated successfully.",
        data: result.data,
    });
}));
const getAllRoleChangeRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserServices.getAllRoleChangeRequest(query);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Changed role retrived successfully.",
        data: result.data,
        meta: result.meta,
    });
}));
const RoleChangeRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const result = yield user_service_1.UserServices.RoleChangeRequest(payload, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Requset change role successfully.",
        data: result.data,
    });
}));
const updateRole = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const { isAccepted } = req.body;
    const result = yield user_service_1.UserServices.updateRole(_id, isAccepted);
    if (result === null || result === void 0 ? void 0 : result.data) {
        if (typeof result.data !== "string") {
            const newUserToken = (0, createUsreToken_1.createToken)(result.data);
            (0, setCookies_1.steCookies)(res, newUserToken);
        }
    }
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Role update",
        data: result === null || result === void 0 ? void 0 : result.data,
    });
}));
const requestRoleStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.requestRoleStats();
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Role Stats.",
        data: result.data,
    });
}));
exports.userControllers = {
    createUser,
    getAllUser,
    getSingleUser,
    getMe,
    updateUser,
    RoleChangeRequest,
    updateRole,
    getAllRoleChangeRequest,
    requestRoleStats,
};
