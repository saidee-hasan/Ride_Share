"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponse = void 0;
const env_config_1 = require("../configs/env.config");
const SendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        meta: (data === null || data === void 0 ? void 0 : data.meta) || null,
        stack: env_config_1.envVars.NODE_ENV === "development" ? data === null || data === void 0 ? void 0 : data.stack : null,
    });
};
exports.SendResponse = SendResponse;
