"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.RoleChange = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = require("../../errorHelpers/AppError");
const env_config_1 = require("../../configs/env.config");
const RoleChangeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    currentRole: { type: String, enum: user_interface_1.Role, required: true },
    requestedRole: { type: String, enum: user_interface_1.Role, required: true },
    status: { type: String, enum: user_interface_1.RoleStatus, required: true },
    Vehicle: { type: String, enum: user_interface_1.IVehicle, default: null },
}, {
    timestamps: true,
    versionKey: false,
});
exports.RoleChange = (0, mongoose_1.model)("RoleChange", RoleChangeSchema);
const authSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, { _id: false, versionKey: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    auth: [authSchema],
    role: { type: String, enum: user_interface_1.Role, default: user_interface_1.Role.USER },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    address: { type: String, default: "Address isn't set yet.", trim: true },
    picture: { type: String },
    isActive: { type: String, enum: user_interface_1.IsActive, default: user_interface_1.IsActive.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    isOnline: { type: String, enum: user_interface_1.IsOnline, default: user_interface_1.IsOnline.ONLINE },
    Vehicle: { type: String, enum: user_interface_1.IVehicle, default: null },
}, { timestamps: true, versionKey: false });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.password) {
                if (this.isModified() || this.isNew) {
                    this.password = yield bcryptjs_1.default.hash(this.password, Number(env_config_1.envVars.BCRYPT_SALT));
                }
            }
            next();
        }
        catch (error) {
            throw new AppError_1.AppError(500, "Faild to hash password.");
        }
    });
});
userSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedDoc = this.getUpdate();
            if (updatedDoc.password) {
                const hashedPassword = yield bcryptjs_1.default.hash(updatedDoc.password, Number(env_config_1.envVars.BCRYPT_SALT));
                updatedDoc.password = hashedPassword;
            }
            next();
        }
        catch (error) {
            throw new AppError_1.AppError(500, "Faild to update hashed password.");
        }
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
