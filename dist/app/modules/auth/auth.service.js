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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = require("../../errorHelpers/AppError");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const env_config_1 = require("../../configs/env.config");
const createUsreToken_1 = require("../../utils/createUsreToken");
const setPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsreExist = yield user_model_1.User.findById(userId);
    if (!isUsreExist) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    if (!isUsreExist.auth.some((provider) => provider.provider === "google")) {
        throw new AppError_1.AppError(400, "You already have a password. To change it visit your profile.");
    }
    const authProvider = {
        provider: "credentials",
        providerId: isUsreExist.email,
    };
    yield user_model_1.User.findByIdAndUpdate(userId, { password, auth: [...isUsreExist.auth, authProvider] }, { runValidators: true });
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsreExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUsreExist) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    const isCorrectPassword = yield bcryptjs_1.default.compare(oldPassword, isUsreExist.password);
    if (!isCorrectPassword) {
        throw new AppError_1.AppError(400, "Wrong password. Please provide the correct password.");
    }
    yield user_model_1.User.findByIdAndUpdate(decodedToken.userId, { password: newPassword }, { runValidators: true });
});
const createAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = (0, jwt_1.verifyToken)(refreshToken, env_config_1.envVars.JWT.JWT_REFRESH_SECRET);
    if (!verifiedToken) {
        throw new AppError_1.AppError(400, "Refresh Token is exprired or invalid.");
    }
    const accessToken = yield (0, createUsreToken_1.createAccessTokenWithRefeshToken)(refreshToken);
    return {
        data: accessToken,
    };
});
exports.AuthServices = {
    setPassword,
    changePassword,
    createAccessToken,
};
