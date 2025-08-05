import { Types } from "mongoose";
import { envVars } from "../configs/env.config";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { AppError } from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { TAuthToken } from "./setCookies";

export const createToken = (
  user: Partial<IUser> & { _id?: Types.ObjectId }
): TAuthToken => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRESIN
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRESIN
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenWithRefeshToken = async (
  refreshToken: string
) => {
  const verifiedToken = verifyToken(
    refreshToken,
    envVars.JWT.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExisted = await User.findById(verifiedToken.userId);

  if (!isUserExisted) {
    throw new AppError(404, "User do not exist.");
  }

  if (
    isUserExisted.isActive === IsActive.BLOCKED ||
    isUserExisted.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExisted.isActive}.`);
  }

  if (isUserExisted.isDeleted) {
    throw new AppError(400, "User is deleted.");
  }

  const jwtPayload = {
    userId: isUserExisted._id,
    email: isUserExisted.email,
    role: isUserExisted.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRESIN
  );

  return accessToken;
};
