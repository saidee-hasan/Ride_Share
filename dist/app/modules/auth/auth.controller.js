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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const passport_1 = __importDefault(require("passport"));
const env_config_1 = require("../../configs/env.config");
const AppError_1 = require("../../errorHelpers/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const createUsreToken_1 = require("../../utils/createUsreToken");
const SendResponse_1 = require("../../utils/SendResponse");
const setCookies_1 = require("../../utils/setCookies");
const auth_service_1 = require("./auth.service");
const credentialLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (error, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return next(new AppError_1.AppError(400, error));
        }
        if (!user) {
            return next(new AppError_1.AppError(404, error));
        }
        const userToken = (0, createUsreToken_1.createToken)(user);
        (0, setCookies_1.steCookies)(res, userToken);
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        (0, SendResponse_1.SendResponse)(res, {
            statusCode: 201,
            success: true,
            message: "Logged in successfully.",
            data: Object.assign(Object.assign({}, userToken), { user: rest }),
        });
    }))(req, res, next);
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body.password;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.setPassword(decodedToken.userId, payload);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "password set successfully.",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "password change successfully.",
        data: null,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env_config_1.envVars.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.clearCookie("refereshToken", {
        httpOnly: true,
        secure: env_config_1.envVars.NODE_ENV === "production",
        sameSite: "lax",
    });
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "logout successfully.",
        data: null,
    });
}));
const createAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refereshToken;
    const result = yield auth_service_1.AuthServices.createAccessToken(refreshToken);
    (0, setCookies_1.steCookies)(res, { accessToken: result.data });
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "access token retrived successfully.",
        data: result.data,
    });
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    let redirect = req.query.state || "/";
    if (redirect.startsWith("/")) {
        redirect = redirect.slice(1);
    }
    const userToken = (0, createUsreToken_1.createToken)(user);
    (0, setCookies_1.steCookies)(res, userToken);
    res.redirect(`${env_config_1.envVars.FRONTEND_URL}/${redirect}`);
}));
exports.AuthControllers = {
    credentialLogin,
    googleCallback,
    setPassword,
    changePassword,
    logout,
    createAccessToken,
};
