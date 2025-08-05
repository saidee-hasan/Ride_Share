import dotenv from "dotenv";
dotenv.config();

interface IEnvVers {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  SUPER_ADMIN: {
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_PHONE: string;
    SUPER_ADMIN_ADDRESS: string;
  };
  GOOGLE: {
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CALLBACK_URL: string;
  };
  BCRYPT_SALT: string;
  JWT: {
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRESIN: string;
    JWT_REFRESH_EXPIRESIN: string;
  };
}

const EnvVarKeys: string[] = [
  "PORT",
  "DB_URI",
  "NODE_ENV",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
  "SUPER_ADMIN_PHONE",
  "SUPER_ADMIN_ADDRESS",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CALLBACK_URL",
  "EXPRESS_SESSION_SECRET",
  "FRONTEND_URL",
  "BCRYPT_SALT",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRESIN",
  "JWT_REFRESH_EXPIRESIN",
];

const loadEnvVars = (): IEnvVers => {
  EnvVarKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not found from .env file.`);
    }
  });
  return {
    PORT: (process.env.PORT as string) || "5000",
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    SUPER_ADMIN: {
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
      SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
      SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
      SUPER_ADMIN_ADDRESS: process.env.SUPER_ADMIN_ADDRESS as string,
    },
    GOOGLE: {
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
      JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN as string,
    },
  };
};

export const envVars = loadEnvVars();
