import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   if (err instanceof RequestValidationError) {
  //     console.log("Handling request validation error");
  //     const formattedErrors = err.errors?.map((error) => {
  //       if (error.type === "field") {
  //         return {
  //           message: error.msg,
  //           field: error.path,
  //         };
  //       }
  //     });
  //     return res.status(400).send({ errors: formattedErrors });
  //   }

  //   if (err instanceof DatabaseConnectionError) {
  //     console.log("Handling request database error");
  //     return res.status(500).send({
  //       errors: [
  //         {
  //           message: err.reason,
  //         },
  //       ],
  //     });
  //   }

  //   if (err instanceof RequestValidationError) {
  //     console.log("Handling request validation error");
  //     return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  //   }

  //   if (err instanceof DatabaseConnectionError) {
  //     console.log("Handling request database error");
  //     return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  //   }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [
      {
        message: err.message || "Something went wrong",
      },
    ],
  });
};
