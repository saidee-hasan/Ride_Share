"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EnvVarKeys = [
    "PORT",
    "DB_URI",
    "NODE_ENV",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_PHONE",
    "SUPER_ADMIN_ADDRESS",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "BCRYPT_SALT",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRESIN",
    "JWT_REFRESH_EXPIRESIN",
];
const loadEnvVars = () => {
    EnvVarKeys.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`${key} is not found from .env file.`);
        }
    });
    return {
        PORT: process.env.PORT || "5000",
        DB_URI: process.env.DB_URI,
        NODE_ENV: process.env.NODE_ENV,
        SUPER_ADMIN: {
            SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
            SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
            SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE,
            SUPER_ADMIN_ADDRESS: process.env.SUPER_ADMIN_ADDRESS,
        },
        GOOGLE: {
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        },
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        BCRYPT_SALT: process.env.BCRYPT_SALT,
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN,
            JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN,
        },
    };
};
exports.envVars = loadEnvVars();
