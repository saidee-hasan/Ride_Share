import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../configs/env.config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "Token not found. You'r unauthorized.");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const isUserExist = await User.findById(verifiedToken.userId);

    if (!isUserExist) {
      throw new AppError(404, "User do not exist.");
    }

    if (!isUserExist.isVerified) {
      throw new AppError(400, "User is not verified.");
    }

    if (
      isUserExist.isActive === IsActive.BLOCKED ||
      isUserExist.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(400, `User is ${isUserExist.isActive}.`);
    }

    if (isUserExist.isDeleted) {
      throw new AppError(400, "User is deleted.");
    }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are forbbiden to access this route.");
    }

    req.user = verifiedToken;

    next();
  });
