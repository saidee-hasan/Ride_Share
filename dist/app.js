"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const notFoundRoute_1 = require("./app/middlewares/notFoundRoute");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const routes_1 = require("./app/routes");
const cors_1 = __importDefault(require("cors"));
require("./app/configs/passport");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_config_1 = require("./app/configs/env.config");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_config_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_config_1.envVars.FRONTEND_URL,
    credentials: true,
}));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json("Welcome to Ride App.");
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFoundRoute_1.notFound);
exports.default = app;
