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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const env_config_1 = require("../configs/env.config");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("Admin already exist.");
            return;
        }
        const authProvider = {
            provider: "credentials",
            providerId: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
        };
        const adminPayload = {
            name: "Admin",
            email: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
            password: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_PASSWORD,
            auth: [authProvider],
            role: user_interface_1.Role.ADMIN,
            phone: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_PHONE,
            address: env_config_1.envVars.SUPER_ADMIN.SUPER_ADMIN_ADDRESS,
            isVerified: true,
        };
        const superAdmin = yield user_model_1.User.create(adminPayload);
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedAdmin = seedAdmin;
