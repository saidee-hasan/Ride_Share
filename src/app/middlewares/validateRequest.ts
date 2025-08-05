import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: ZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
