"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handkeZodError = void 0;
const handkeZodError = (error) => {
    const errorSources = [];
    error.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path.join(" -> "),
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources,
    };
};
exports.handkeZodError = handkeZodError;
