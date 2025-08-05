"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordZodSchema = exports.setPasswordZodSchema = exports.credentialLoginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.credentialLoginZodSchema = zod_1.default.object({
    email: zod_1.default.email({ message: "Invalied email address." }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
});
exports.setPasswordZodSchema = zod_1.default.object({
    password: zod_1.default
        .string()
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
});
exports.changePasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string()
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
    newPassword: zod_1.default
        .string()
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
});
