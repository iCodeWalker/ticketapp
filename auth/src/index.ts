import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signUpRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

/** handling not defined routes */
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startApp = async () => {
  /** First we try to connect to database and when we have successfully connected */
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to Mongo server");
  } catch (err) {
    console.error(err);
  }

  /** Start the server */
  app.listen(3000, () => {
    console.log("Listening on port: 3000 ");
  });
};

startApp();
