import { NextFunction, Request, Response } from "express";
import { envVars } from "../configs/env.config";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handkeZodError } from "../errorHelpers/handkeZodError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { AppError } from "../errorHelpers/AppError";
import { TErrorSources } from "../interfaces/globalErrorhandler";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(error);
  }
  let status = 500;
  let message = `something went wrong.`;

  if (error?.code === 11000) {
    const simplefiedError = handleDuplicateError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
  } else if (error.name === "CastError") {
    const simplefiedError = handleCastError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
  } else if (error.name === "ZodError") {
    const simplefiedError = handkeZodError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
    error = simplefiedError.errorSources as TErrorSources[];
  } else if (error.name === "ValidationError") {
    const simplefiedError = handleValidationError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
    error = simplefiedError.errorSources as TErrorSources[];
  } else if (error instanceof AppError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(status).json({
    success: false,
    message: message,
    error: error,
    stack: error.stack,
  });
};
