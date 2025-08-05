"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (error) => {
    const matchedArray = error.errmsg.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exist.`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
