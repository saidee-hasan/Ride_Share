import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { RideRequestZodSchema } from "./ride.validation";

const router = Router();

router.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(RideRequestZodSchema),
  RideControllers.rideRequest
);

router.patch(
  "/cancel",
  checkAuth(...Object.values(Role)),
  RideControllers.rideCancel
);

router.get(
  "/history",
  checkAuth(...Object.values(Role)),
  RideControllers.rideHistory
);

router.delete(
  "/delete-all-cancel",
  checkAuth(Role.ADMIN),
  RideControllers.rideCancelDeletion
);

router.get(
  "/all-history",
  checkAuth(Role.ADMIN),
  RideControllers.allRideHistory
);

export const RideRouter = router;
