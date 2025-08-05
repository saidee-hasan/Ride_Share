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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const env_config_1 = require("./env.config");
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        return done("User does not exist. Please register.");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        return done(`Filed to login. User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        return done("User is deleted. Please contact with our team.");
    }
    if (!isUserExist.isVerified) {
        return done("Please verify your email address.");
    }
    const userAuthenticated = isUserExist.auth.some((provider) => provider.provider === "google");
    if (userAuthenticated && !isUserExist.password) {
        return done("You are already authenticaed with Google. Please login with google and set a password from your profile if email password login needed.");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        return done("Incorrect Password.");
    }
    return done(null, isUserExist);
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.envVars.GOOGLE.GOOGLE_CLIENT_ID,
    clientSecret: env_config_1.envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
    callbackURL: env_config_1.envVars.GOOGLE.GOOGLE_CALLBACK_URL,
}, (assessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
    if (!email) {
        return done("Email not found.");
    }
    let user = yield user_model_1.User.findOne({ email });
    if (user &&
        (user.isActive === user_interface_1.IsActive.BLOCKED ||
            user.isActive === user_interface_1.IsActive.INACTIVE)) {
        return done(null, false, {
            message: `User is ${user.isActive}.`,
        });
    }
    if (user && user.isDeleted) {
        return done(null, false, { message: "User is deleted." });
    }
    if (!user) {
        user = yield user_model_1.User.create({
            name: profile.displayName,
            email,
            auth: [{ provider: "google", providerId: email }],
            role: user_interface_1.Role.USER,
            picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
            isVerified: true,
        });
    }
    return done(null, user);
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
