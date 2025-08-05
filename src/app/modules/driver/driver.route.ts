import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverControllers } from "./driver.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { beADriverZodSchema } from "./driver.validation";

const router = Router();

router.get(
  "/get-ride-request",
  checkAuth(Role.DRIVER, Role.ADMIN),
  DriverControllers.getRideRequest
);

router.get(
  "/earning-history",
  checkAuth(Role.DRIVER),
  DriverControllers.getEarningHistory
);

router.get(
  "/pending-ride/:id",
  checkAuth(Role.DRIVER),
  DriverControllers.pendingRideStatus
);

router.patch(
  "/request/:id",
  checkAuth(Role.DRIVER, Role.ADMIN),
  validateRequest(beADriverZodSchema),
  DriverControllers.beADriver
);

export const DriverRouter = router;
