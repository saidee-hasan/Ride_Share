"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beADriverZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("../ride/ride.interface");
exports.beADriverZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)),
});
