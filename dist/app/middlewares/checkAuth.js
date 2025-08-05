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
exports.checkAuth = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../errorHelpers/AppError");
const jwt_1 = require("../utils/jwt");
const env_config_1 = require("../configs/env.config");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        throw new AppError_1.AppError(403, "Token not found. You'r unauthorized.");
    }
    const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_config_1.envVars.JWT.JWT_ACCESS_SECRET);
    const isUserExist = yield user_model_1.User.findById(verifiedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.AppError(404, "User do not exist.");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.AppError(400, "User is not verified.");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.AppError(400, `User is ${isUserExist.isActive}.`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.AppError(400, "User is deleted.");
    }
    if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError_1.AppError(403, "You are forbbiden to access this route.");
    }
    req.user = verifiedToken;
    next();
}));
exports.checkAuth = checkAuth;
