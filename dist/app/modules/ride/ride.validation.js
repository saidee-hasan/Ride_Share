"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.RideRequestZodSchema = zod_1.default.object({
    location: zod_1.default.object({
        from: zod_1.default.object({
            lat: zod_1.default.number().min(-90).max(90),
            lng: zod_1.default.number().min(-180).max(180),
        }),
        to: zod_1.default.object({
            lat: zod_1.default.number().min(-90).max(90),
            lng: zod_1.default.number().min(-180).max(180),
        }),
    }),
});
