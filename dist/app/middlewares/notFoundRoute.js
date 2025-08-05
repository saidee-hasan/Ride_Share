"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `${req.path} route is not found`,
        error: "Path not found",
    });
};
exports.notFound = notFound;
