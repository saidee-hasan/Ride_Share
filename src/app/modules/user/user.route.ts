import { Router } from "express";
import {
  createUserZodSchema,
  RoleChangeRequestZodSchema,
  updateRoleZodeSchema,
  updateUserZodSchema,
} from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/create",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/", checkAuth(Role.ADMIN), userControllers.getAllUser);

router.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe);

router.get(
  "/req-role/all-req",
  checkAuth(Role.ADMIN),
  userControllers.getAllRoleChangeRequest
);

router.get(
  "/req-role/stats",
  checkAuth(Role.ADMIN),
  userControllers.requestRoleStats
);

router.post(
  "/req-role/request",
  checkAuth(...Object.values(Role)),
  validateRequest(RoleChangeRequestZodSchema),
  userControllers.RoleChangeRequest
);

router.patch(
  "/req-role/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateRoleZodeSchema),
  userControllers.updateRole
);

router.get("/:id", checkAuth(Role.ADMIN), userControllers.getSingleUser);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userControllers.updateUser
);

export const UserRoute = router;
