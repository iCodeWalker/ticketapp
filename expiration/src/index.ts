// import express from "express";
// import "express-async-errors";
// import { json } from "body-parser";
// import cookieSession from "cookie-session";

// import { currentUserRouter } from "./routes/current-user";
// import { signUpRouter } from "./routes/signup";
// import { signInRouter } from "./routes/signin";
// import { signOutRouter } from "./routes/signout";
// import { errorHandler } from "./middlewares/error-handler";
// import { NotFoundError } from "./errors/not-found-error";
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
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID Not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL Not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID Not defined");
  }
  /** First we try to connect to database and when we have successfully connected */
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    /** Gracefully closing the connection */
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    /** Gracefully closing the connection */
  } catch (err) {
    console.error(err);
  }
};

startApp();
