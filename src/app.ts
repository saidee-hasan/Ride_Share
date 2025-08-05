import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { notFound } from "./app/middlewares/notFoundRoute";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import cors from "cors";
import "./app/configs/passport";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/configs/env.config";

const app: Application = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to Ride App.");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
