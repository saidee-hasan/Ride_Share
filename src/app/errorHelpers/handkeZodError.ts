import { TError, TErrorSources } from "../interfaces/globalErrorhandler";

export const handkeZodError = (error: any): TError => {
  const errorSources: TErrorSources[] = [];

  error.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path.join(" -> "),
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
