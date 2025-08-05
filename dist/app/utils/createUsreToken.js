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
exports.createAccessTokenWithRefeshToken = exports.createToken = void 0;
const env_config_1 = require("../configs/env.config");
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("./jwt");
const AppError_1 = require("../errorHelpers/AppError");
const user_model_1 = require("../modules/user/user.model");
const createToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_ACCESS_SECRET, env_config_1.envVars.JWT.JWT_ACCESS_EXPIRESIN);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_REFRESH_SECRET, env_config_1.envVars.JWT.JWT_REFRESH_EXPIRESIN);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createToken = createToken;
const createAccessTokenWithRefeshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = (0, jwt_1.verifyToken)(refreshToken, env_config_1.envVars.JWT.JWT_REFRESH_SECRET);
    const isUserExisted = yield user_model_1.User.findById(verifiedToken.userId);
    if (!isUserExisted) {
        throw new AppError_1.AppError(404, "User do not exist.");
    }
    if (isUserExisted.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExisted.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.AppError(400, `User is ${isUserExisted.isActive}.`);
    }
    if (isUserExisted.isDeleted) {
        throw new AppError_1.AppError(400, "User is deleted.");
    }
    const jwtPayload = {
        userId: isUserExisted._id,
        email: isUserExisted.email,
        role: isUserExisted.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_ACCESS_SECRET, env_config_1.envVars.JWT.JWT_ACCESS_EXPIRESIN);
    return accessToken;
});
exports.createAccessTokenWithRefeshToken = createAccessTokenWithRefeshToken;
