"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const ride_route_1 = require("../modules/ride/ride.route");
const driver_route_1 = require("../modules/driver/driver.route");
exports.router = (0, express_1.Router)();
const modulesRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoute,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/ride",
        route: ride_route_1.RideRouter,
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRouter,
    },
];
modulesRoutes.forEach(({ path, route }) => {
    exports.router.use(path, route);
});
