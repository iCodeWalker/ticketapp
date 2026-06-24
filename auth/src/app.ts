import express from "express";
import "express-async-errors";
import { json } from "body-parser";
// import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signUpRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // trust ingress-nginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // Will not encrypt the cookie
    secure: true, // cookie will only be used if the user is usign https connection
  }),
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

/** handling not defined routes */
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
