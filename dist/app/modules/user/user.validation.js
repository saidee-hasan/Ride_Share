"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleZodeSchema = exports.RoleChangeRequestZodSchema = exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, { message: "User name should be atleast 1 character." }),
    email: zod_1.default.email({ message: "Invalied email address." }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
    phone: zod_1.default.string().regex(/^(?:\+8801\d{9})|01\d{9}$/, {
        message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    }),
    address: zod_1.default.string().optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, { message: "User name should be atleast 1 character." })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d[9])|01\d[9]$/, {
        message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    address: zod_1.default.string().optional(),
    isOnline: zod_1.default.enum(Object.values(user_interface_1.IsOnline)).optional(),
});
exports.RoleChangeRequestZodSchema = zod_1.default.object({
    reqRole: zod_1.default.enum([user_interface_1.Role.ADMIN, user_interface_1.Role.DRIVER], {
        message: "Can't request for being a user.",
    }),
    vehicle: zod_1.default
        .enum(Object.values(user_interface_1.IVehicle), {
        message: "Only Car and Bike are allowed.",
    })
        .optional(),
});
exports.updateRoleZodeSchema = zod_1.default.object({
    isAccepted: zod_1.default.enum([user_interface_1.RoleStatus.ACCEPTED, user_interface_1.RoleStatus.CANCELED]),
});
