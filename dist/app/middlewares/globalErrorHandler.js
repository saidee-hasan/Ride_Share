"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_config_1 = require("../configs/env.config");
const handleDuplicateError_1 = require("../errorHelpers/handleDuplicateError");
const handleCastError_1 = require("../errorHelpers/handleCastError");
const handkeZodError_1 = require("../errorHelpers/handkeZodError");
const handleValidationError_1 = require("../errorHelpers/handleValidationError");
const AppError_1 = require("../errorHelpers/AppError");
const globalErrorHandler = (error, req, res, next) => {
    if (env_config_1.envVars.NODE_ENV === "development") {
        console.log(error);
    }
    let status = 500;
    let message = `something went wrong.`;
    if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const simplefiedError = (0, handleDuplicateError_1.handleDuplicateError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
    }
    else if (error.name === "CastError") {
        const simplefiedError = (0, handleCastError_1.handleCastError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
    }
    else if (error.name === "ZodError") {
        const simplefiedError = (0, handkeZodError_1.handkeZodError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
        error = simplefiedError.errorSources;
    }
    else if (error.name === "ValidationError") {
        const simplefiedError = (0, handleValidationError_1.handleValidationError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
        error = simplefiedError.errorSources;
    }
    else if (error instanceof AppError_1.AppError) {
        status = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    res.status(status).json({
        success: false,
        message: message,
        error: error,
        stack: error.stack,
    });
};
exports.globalErrorHandler = globalErrorHandler;
