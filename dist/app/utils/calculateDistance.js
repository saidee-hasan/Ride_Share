"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = void 0;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (angle) => (angle * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const area = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const coordibate = 2 * Math.atan2(Math.sqrt(area), Math.sqrt(1 - area));
    return R * coordibate;
};
exports.calculateDistance = calculateDistance;
