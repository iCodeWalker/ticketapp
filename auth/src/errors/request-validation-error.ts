import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
// #### Option : 1
// interface CustomError {
//   statusCode: number;
//   serializeErrors(): { message: string; field?: string }[];
// }

// export class RequestValidationError extends Error implements CustomError {
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  /** Instead of extracting the error in the error handler we have done it here */
  serializeErrors() {
    return this.errors?.map((error) => {
      if (error.type === "field") {
        return {
          message: error.msg,
          field: error.path,
        };
      }
      return { message: error.msg };
    });
  }
}
