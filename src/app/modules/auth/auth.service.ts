import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelpers/AppError";
import { IAuthProviders } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../configs/env.config";
import { createAccessTokenWithRefeshToken } from "../../utils/createUsreToken";

const setPassword = async (userId: string, password: string) => {
  const isUsreExist = await User.findById(userId);

  if (!isUsreExist) {
    throw new AppError(404, "User not found.");
  }

  if (!isUsreExist.auth.some((provider) => provider.provider === "google")) {
    throw new AppError(
      400,
      "You already have a password. To change it visit your profile."
    );
  }

  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: isUsreExist.email,
  };

  await User.findByIdAndUpdate(
    userId,
    { password, auth: [...isUsreExist.auth, authProvider] },
    { runValidators: true }
  );
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const isUsreExist = await User.findById(decodedToken.userId);

  if (!isUsreExist) {
    throw new AppError(404, "User not found.");
  }

  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    isUsreExist.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(
      400,
      "Wrong password. Please provide the correct password."
    );
  }

  await User.findByIdAndUpdate(
    decodedToken.userId,
    { password: newPassword },
    { runValidators: true }
  );
};

const createAccessToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    envVars.JWT.JWT_REFRESH_SECRET
  ) as JwtPayload;

  if (!verifiedToken) {
    throw new AppError(400, "Refresh Token is exprired or invalid.");
  }

  const accessToken = await createAccessTokenWithRefeshToken(refreshToken);

  return {
    data: accessToken,
  };
};

export const AuthServices = {
  setPassword,
  changePassword,
  createAccessToken,
};
