import { TError } from "../interfaces/globalErrorhandler";

export const handleDuplicateError = (error: any): TError => {
  const matchedArray = error.errmsg.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exist.`,
  };
};
