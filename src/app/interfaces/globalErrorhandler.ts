export interface TErrorSources {
  path: string;
  message: string;
}
export interface TError {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources[];
}
