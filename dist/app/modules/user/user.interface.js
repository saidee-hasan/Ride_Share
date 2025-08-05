"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IVehicle = exports.IsOnline = exports.RoleStatus = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var RoleStatus;
(function (RoleStatus) {
    RoleStatus["PENDING"] = "PENDING";
    RoleStatus["ACCEPTED"] = "ACCEPTED";
    RoleStatus["CANCELED"] = "CANCELED";
})(RoleStatus || (exports.RoleStatus = RoleStatus = {}));
var IsOnline;
(function (IsOnline) {
    IsOnline["ONLINE"] = "ONLINE";
    IsOnline["OFFLINE"] = "OFFLINE";
})(IsOnline || (exports.IsOnline = IsOnline = {}));
var IVehicle;
(function (IVehicle) {
    IVehicle["CAR"] = "CAR";
    IVehicle["BIKE"] = "BIKE";
})(IVehicle || (exports.IVehicle = IVehicle = {}));
