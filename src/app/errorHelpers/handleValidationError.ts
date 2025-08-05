import mongoose from "mongoose";
import { TError, TErrorSources } from "../interfaces/globalErrorhandler";

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): TError => {
  const errorSources: TErrorSources[] = [];

  const errors = Object.values(error.errors);
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
