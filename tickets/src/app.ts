import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@vkticketscommon/common";

const app = express();
app.set("trust proxy", true); // trust ingress-nginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // Will not encrypt the cookie
    secure: process.env.NODE_ENV !== "test", // cookie will only be used if the user is usign https connection
    // When jest run test it sets the process.env.NODE_ENV to "test"
  }),
);

/** handling not defined routes */
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
