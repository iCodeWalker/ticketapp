// import express from "express";
// import "express-async-errors";
// import { json } from "body-parser";
import mongoose from "mongoose";
// import cookieSession from "cookie-session";

// import { currentUserRouter } from "./routes/current-user";
// import { signUpRouter } from "./routes/signup";
// import { signInRouter } from "./routes/signin";
// import { signOutRouter } from "./routes/signout";
// import { errorHandler } from "./middlewares/error-handler";
// import { NotFoundError } from "./errors/not-found-error";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

// const app = express();
// app.set("trust proxy", true); // trust ingress-nginx proxy
// app.use(json());
// app.use(
//   cookieSession({
//     signed: false, // Will not encrypt the cookie
//     secure: true, // cookie will only be used if the user is usign https connection
//   }),
// );

// app.use(currentUserRouter);
// app.use(signUpRouter);
// app.use(signInRouter);
// app.use(signOutRouter);

// /** handling not defined routes */
// app.all("*", async () => {
//   throw new NotFoundError();
// });

// app.use(errorHandler);

const startApp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI Not defined");
  }
  /** First we try to connect to database and when we have successfully connected */
  try {
    await natsWrapper.connect("ticketapp", "asda", "http://nats-srv:4222");

    /** Gracefully closing the connection */
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    /** Gracefully closing the connection */

    await mongoose.connect(process.env.MONGO_URI);
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
