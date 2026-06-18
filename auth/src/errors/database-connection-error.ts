import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 500;

  constructor() {
    super("Error connecting to database");
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  /** Instead of extracting the error in the error handler we have done it here */
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
