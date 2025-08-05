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
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_validation_1 = require("./auth.validation");
const passport_1 = __importDefault(require("passport"));
const env_config_1 = require("../../configs/env.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.credentialLoginZodSchema), auth_controller_1.AuthControllers.credentialLogin);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/refresh-token", auth_controller_1.AuthControllers.createAccessToken);
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(auth_validation_1.setPasswordZodSchema), auth_controller_1.AuthControllers.setPassword);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(auth_validation_1.changePasswordZodSchema), auth_controller_1.AuthControllers.changePassword);
// google-passport
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const redirect = (_a = req.query) === null || _a === void 0 ? void 0 : _a.redirect;
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${env_config_1.envVars.FRONTEND_URL}/login?error=Something went wrong. Please contact to our team.`,
}), auth_controller_1.AuthControllers.googleCallback);
exports.AuthRouter = router;
