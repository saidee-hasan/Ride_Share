"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const distanceSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
}, { _id: false, versionKey: false });
const locationSchema = new mongoose_1.Schema({
    from: distanceSchema,
    to: distanceSchema,
}, { _id: false, versionKey: false });
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    rideStatus: {
        type: String,
        enum: ride_interface_1.RideStatus,
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    costOfRide: { type: Number, required: true, min: 10 },
    phone: { type: String, trim: true },
    location: locationSchema,
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
rideSchema.virtual("rideTime").get(function () {
    if (!this.createdAt || !this.updatedAt)
        return null;
    const duration = this.updatedAt.getTime() - this.createdAt.getTime();
    const totalMinutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0 && minutes === 0)
        return "0m";
    if (hours === 0)
        return `${minutes}m`;
    if (minutes === 0)
        return `${hours}h`;
    return `${hours}h ${minutes}m`;
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
