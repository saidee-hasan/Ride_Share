import { Response } from "express";
import { envVars } from "../configs/env.config";

export interface TAuthToken {
  accessToken?: string;
  refreshToken?: string;
}

export const steCookies = (
  res: Response,
  { accessToken, refreshToken }: TAuthToken
) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  if (refreshToken) {
    res.cookie("refereshToken", refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
