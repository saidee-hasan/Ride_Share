import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  changePasswordZodSchema,
  credentialLoginZodSchema,
  setPasswordZodSchema,
} from "./auth.validation";
import passport from "passport";
import { envVars } from "../../configs/env.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/login",
  validateRequest(credentialLoginZodSchema),
  AuthControllers.credentialLogin
);

router.post("/logout", AuthControllers.logout);

router.post("/refresh-token", AuthControllers.createAccessToken);

router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  validateRequest(setPasswordZodSchema),
  AuthControllers.setPassword
);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthControllers.changePassword
);

// google-passport
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query?.redirect;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=Something went wrong. Please contact to our team.`,
  }),
  AuthControllers.googleCallback
);

export const AuthRouter = router;
