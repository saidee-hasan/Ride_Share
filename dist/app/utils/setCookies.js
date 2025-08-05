"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steCookies = void 0;
const env_config_1 = require("../configs/env.config");
const steCookies = (res, { accessToken, refreshToken }) => {
    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: env_config_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
    if (refreshToken) {
        res.cookie("refereshToken", refreshToken, {
            httpOnly: true,
            secure: env_config_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
};
exports.steCookies = steCookies;
