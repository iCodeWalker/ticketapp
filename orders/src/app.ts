import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@vkticketscommon/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

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

app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

/** handling not defined routes */
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
